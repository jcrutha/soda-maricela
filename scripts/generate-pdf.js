import fs from 'fs';
import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const languages = ['es', 'en'];
const dataDir = path.join(rootDir, 'src/data');
const outputDir = path.join(rootDir, 'public');
const USD_RATE = 515;

// Ensure public dir exists
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

languages.forEach(lang => {
    const dataPath = path.join(dataDir, `menu.${lang}.json`);
    if (fs.existsSync(dataPath)) {
        console.log(`Reading ${dataPath}...`);
        const menuData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        generatePDF(menuData, lang);
    } else {
        console.log(`File not found: ${dataPath}`);
    }
});

function generatePDF(data, lang) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const outputPath = path.join(outputDir, `menu-${lang}.pdf`);
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);

    // Header
    doc.fontSize(30).font('Helvetica-Bold').text('Soda Maricela', { align: 'center' });
    doc.fontSize(12).font('Helvetica').text(lang === 'es' ? 'Menú' : 'Menu', { align: 'center' });
    doc.moveDown(2);

    // Categories
    if (data.categories) {
        data.categories.forEach(category => {
            // Check if we need a new page (rough estimation)
            if (doc.y > 700) {
                doc.addPage();
            }

            // Category Title
            doc.fontSize(20).fillColor('#ea580c').font('Helvetica-Bold').text(category.name);
            doc.rect(50, doc.y, 500, 2).fill('#ea580c'); // Underline
            doc.moveDown(1);
            doc.fillColor('black');

            category.items.forEach(item => {
                if (doc.y > 700) {
                    doc.addPage();
                }

                // Item Name and Price
                doc.fontSize(14).font('Helvetica-Bold').text(item.name, { continued: true });
                doc.fontSize(14).font('Helvetica-Bold').text(`   ₡${item.price_crc.toLocaleString()}`, { align: 'right' });
                
                // USD Price
                const priceUsd = (item.price_crc / USD_RATE).toFixed(2);
                doc.fontSize(10).font('Helvetica').fillColor('#666').text(`$${priceUsd}`, { align: 'right' });
                doc.fillColor('black');

                // Description
                if (item.description) {
                    doc.fontSize(11).font('Helvetica').text(item.description, {
                        width: 400,
                        align: 'left'
                    });
                }
                
                doc.moveDown(1);
            });

            doc.moveDown(1);
        });
    }

    doc.end();
    console.log(`Generated ${outputPath}`);
}
