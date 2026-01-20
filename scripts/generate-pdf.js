import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONSTANTS ---
const USD_RATE = 515;
// Use 0 margins in doc to prevent auto-page-breaks by footer
const PAGE_HEIGHT = 841.89; // A4 height
const PAGE_WIDTH = 595.28;  // A4 width

// Manual "Safety" Margins for Content
const SAFE_TOP = 40;
const SAFE_BOTTOM = 60; // Stop content here to leave room for footer
const SAFE_SIDES = 40;
const CONTENT_BOTTOM_LIMIT = PAGE_HEIGHT - SAFE_BOTTOM;

const COLORS = {
    primary: '#ea580c',
    text: '#1f2937',
    lightText: '#6b7280',
    price: '#000000',
    usd: '#9ca3af'
};

const FONTS = {
    bold: 'Helvetica-Bold',
    regular: 'Helvetica',
    italic: 'Helvetica-Oblique'
};

// --- PATHS ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const dataDir = path.join(rootDir, 'src/data');
const outputDir = path.join(rootDir, 'public');

function stripAccents(str) {
    if (!str) return '';
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// --- MAIN EXECUTION ---
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

['es', 'en'].forEach(lang => {
    const dataPath = path.join(dataDir, `menu.${lang}.json`);
    if (fs.existsSync(dataPath)) {
        console.log(`Processing ${lang}...`);
        const menuData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        createPDF(menuData, lang);
    }
});

function createPDF(data, lang) {
    // 1. Initialize with ZERO margins to control everything manually
    const doc = new PDFDocument({
        autoFirstPage: false,
        bufferPages: true,
        size: 'A4',
        margins: { top: 0, bottom: 0, left: 0, right: 0 } 
    });

    const outputPath = path.join(outputDir, `menu_final_v4_${lang}.pdf`);
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // 2. Add first page
    doc.addPage(); 
    // Reset cursor to safe top
    doc.y = SAFE_TOP;

    drawMainTitle(doc, lang);

    if (data.categories) {
        for (const category of data.categories) {
            // Calculate height of the entire category
            const catHeight = measureCategoryHeight(doc, category);
            const remainingSpace = CONTENT_BOTTOM_LIMIT - doc.y;

            // Decision:
            // 1. If it fits entirely in the remaining space, print it.
            // 2. If it DOESN'T fit in remaining space:
            //    a. If it fits on a FRESH page, add page and print there (Keep Together).
            //    b. If it is larger than a fresh page (huge category), we must split it.
            //       But we should start on a new page to minimize fragmentation if we are currently low on space.
            //       Let's say if we have less than 1/3 page left, just start fresh.
            
            const fitsOnCurrent = catHeight < remainingSpace;
            const fitsOnFresh = catHeight < (CONTENT_BOTTOM_LIMIT - SAFE_TOP);
            
            if (!fitsOnCurrent) {
                if (fitsOnFresh) {
                    // Fits on a new page -> Move it there to keep it contiguous
                    doc.addPage();
                    doc.y = SAFE_TOP;
                } else {
                    // Doesn't fit on current, and is too big for a single page anyway.
                    // If we have very little space left (e.g. < 200 pts), start fresh.
                    // If we have lots of space, maybe fill it? 
                    // User complained about weird splits. Safer to start big categories on top.
                    doc.addPage();
                    doc.y = SAFE_TOP;
                }
            }

            drawCategoryHeader(doc, category.name);

            if (category.items) {
                for (const item of category.items) {
                    // Standard item break check (safety for very long lists)
                    // Calculate exact item height needed
                    const itemH = measureItemHeight(doc, item);
                    if (doc.y + itemH > CONTENT_BOTTOM_LIMIT) {
                        doc.addPage();
                        doc.y = SAFE_TOP;
                    }
                    drawItem(doc, item);
                }
            }
            
            doc.moveDown(1);
        }
    }

    // 3. Add Footers (Safe now because margins are 0)
    const range = doc.bufferedPageRange();
    const totalPages = range.count;

    for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        
        const footerY = PAGE_HEIGHT - 30; // Position at bottom

        doc.save();
        
        doc.strokeColor('#e5e7eb').lineWidth(1)
           .moveTo(SAFE_SIDES, footerY - 10)
           .lineTo(PAGE_WIDTH - SAFE_SIDES, footerY - 10)
           .stroke();

        doc.fontSize(8).fillColor(COLORS.lightText).font(FONTS.regular);
        const leftText = 'Soda Maricela';
        const rightText = `${lang === 'es' ? 'Pagina' : 'Page'} ${i + 1} / ${totalPages}`;

        doc.text(leftText, SAFE_SIDES, footerY, { 
            align: 'left', 
            baseline: 'bottom',
            width: 200
        });

        doc.text(rightText, PAGE_WIDTH - SAFE_SIDES - 200, footerY, { 
            align: 'right', 
            baseline: 'bottom',
            width: 200
        });

        doc.restore();
    }

    doc.end();
    console.log(`✅ Generated: ${outputPath}`);
}

function measureCategoryHeight(doc, category) {
    let h = 0;
    // Header height (rect height + spacing)
    h += 24 + 15; 

    if (category.items) {
        for (const item of category.items) {
            h += measureItemHeight(doc, item);
        }
    }
    // Add bottom spacing
    h += 12; // doc.moveDown(1) approx
    return h;
}

function measureItemHeight(doc, item) {
    const contentWidth = PAGE_WIDTH - (SAFE_SIDES * 2);
    const priceColWidth = 100;
    const textColWidth = contentWidth - priceColWidth - 10;

    let textH = 0;
    
    // Simulate Text Column
    doc.font(FONTS.bold).fontSize(12);
    textH += doc.heightOfString(stripAccents(item.name), { width: textColWidth });

    if (item.description) {
        textH += 3; // Approx gap for moveDown(0.2)
        doc.font(FONTS.italic).fontSize(10);
        textH += doc.heightOfString(stripAccents(item.description), { width: textColWidth });
    }

    // Simulate Price Column
    let priceH = 0;
    doc.font(FONTS.bold).fontSize(12);
    priceH += doc.heightOfString(`CRC 0000`, { width: priceColWidth }); // Dummy price text
    doc.font(FONTS.regular).fontSize(9);
    priceH += doc.heightOfString(`$0.00`, { width: priceColWidth });

    return Math.max(textH, priceH) + 20; // +20 padding/margin (Increased safety buffer)
}

function drawMainTitle(doc, lang) {
    doc.fillColor(COLORS.primary)
       .fontSize(26)
       .font(FONTS.bold)
       .text('SODA MARICELA', SAFE_SIDES, doc.y, { align: 'center', width: PAGE_WIDTH - (SAFE_SIDES*2) });
    
    doc.fillColor(COLORS.lightText)
       .fontSize(10)
       .font(FONTS.regular)
       .text(lang === 'es' ? 'Sabor autentico costarricense' : 'Authentic Costa Rican Flavor', {
           align: 'center',
           characterSpacing: 1,
           width: PAGE_WIDTH - (SAFE_SIDES*2)
       });
    
    doc.moveDown(1.5);
}

function drawCategoryHeader(doc, name) {
    const currentY = doc.y;
    const height = 24;
    const width = PAGE_WIDTH - (SAFE_SIDES * 2);

    doc.rect(SAFE_SIDES, currentY, width, height).fill(COLORS.primary);

    doc.fillColor('white')
       .fontSize(14)
       .font(FONTS.bold)
       .text(stripAccents(name.toUpperCase()), SAFE_SIDES + 10, currentY + 6);
    
    doc.y = currentY + height + 15;
}

function drawItem(doc, item) {
    const startY = doc.y;
    const contentWidth = PAGE_WIDTH - (SAFE_SIDES * 2);
    const priceColWidth = 100;
    const textColWidth = contentWidth - priceColWidth - 10;

    // Prices (Right)
    doc.font(FONTS.bold).fontSize(12).fillColor(COLORS.price);
    const priceStr = `CRC ${item.price_crc.toLocaleString('en-US')}`;
    
    doc.text(priceStr, SAFE_SIDES + textColWidth, startY, {
        width: priceColWidth,
        align: 'right'
    });

    const usdPrice = (item.price_crc / USD_RATE).toFixed(2);
    doc.font(FONTS.regular).fontSize(9).fillColor(COLORS.usd);
    doc.text(`$${usdPrice}`, SAFE_SIDES + textColWidth, doc.y, {
        width: priceColWidth,
        align: 'right'
    });
    
    const endY_Price = doc.y;

    // Text (Left)
    doc.y = startY; 
    doc.font(FONTS.bold).fontSize(12).fillColor(COLORS.text);
    doc.text(stripAccents(item.name), SAFE_SIDES, startY, {
        width: textColWidth
    });

    if (item.description) {
        doc.moveDown(0.2);
        doc.font(FONTS.italic).fontSize(10).fillColor(COLORS.lightText);
        doc.text(stripAccents(item.description), SAFE_SIDES, doc.y, {
            width: textColWidth
        });
    }
    
    const endY_Text = doc.y;

    doc.y = Math.max(endY_Price, endY_Text) + 10;

    doc.save();
    doc.strokeColor('#f3f4f6').lineWidth(0.5)
       .moveTo(SAFE_SIDES, doc.y - 5)
       .lineTo(PAGE_WIDTH - SAFE_SIDES, doc.y - 5)
       .stroke();
    doc.restore();
}
