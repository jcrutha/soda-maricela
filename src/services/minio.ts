import * as fs from 'fs/promises';
import Papa from 'papaparse';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import type { AdminMenuItem, PublicMenuItem } from '../types';

// MinIO Configuration from Environment Variables
const MINIO_ENDPOINT = import.meta.env.MINIO_ENDPOINT;
const MINIO_PORT = parseInt(import.meta.env.MINIO_PORT || '9000', 10);
const MINIO_ACCESS_KEY = import.meta.env.MINIO_ACCESS_KEY;
const MINIO_SECRET_KEY = import.meta.env.MINIO_SECRET_KEY;
const MINIO_BUCKET = import.meta.env.MINIO_BUCKET;
const MINIO_FILE_NAME = 'menu.csv'; // Assuming the file name is constant

async function getCsvData(): Promise<string> {
  // For local development, read from the placeholder file
  if (import.meta.env.DEV) {
    try {
      const csvData = await fs.readFile('menu.csv', 'utf-8');
      return csvData;
    } catch (error) {
      console.error('Error reading local CSV file:', error);
      throw new Error('Could not read menu.csv. Make sure the file exists in the root directory.');
    }
  }

  // Production logic to fetch from MinIO
  if (!MINIO_ENDPOINT || !MINIO_ACCESS_KEY || !MINIO_SECRET_KEY || !MINIO_BUCKET) {
    throw new Error('MinIO environment variables are not set.');
  }

  const s3Client = new S3Client({
    endpoint: `http://${MINIO_ENDPOINT}:${MINIO_PORT}`,
    region: 'us-east-1', // Default region for MinIO
    credentials: {
      accessKeyId: MINIO_ACCESS_KEY,
      secretAccessKey: MINIO_SECRET_KEY,
    },
    forcePathStyle: true, // Required for MinIO
  });

  const command = new GetObjectCommand({
    Bucket: MINIO_BUCKET,
    Key: MINIO_FILE_NAME,
  });

  try {
    const response = await s3Client.send(command);
    // Convert the stream to a string
    return response.Body?.transformToString() || '';
  } catch (error) {
    console.error('Error fetching from MinIO:', error);
    throw new Error('Failed to fetch menu.csv from MinIO.');
  }
}

function transformToPublicMenuItem(adminItem: AdminMenuItem): PublicMenuItem {
  return {
    category: adminItem.Categoria,
    name: adminItem.Nombre,
    description: adminItem.Descripcion,
    priceCRC: parseFloat(adminItem.Precio_CRC),
  };
}

export async function getMenuItemsGroupedByCategory() {
  const csvString = await getCsvData();

  if (!csvString) {
    return {}; // Return an empty object if the CSV is empty
  }

  const parsed = Papa.parse<AdminMenuItem>(csvString, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    console.error('Errors parsing CSV:', parsed.errors);
    throw new Error('Failed to parse menu.csv');
  }

  const publicItems = parsed.data.map(transformToPublicMenuItem);

  const groupedMenu = publicItems.reduce((acc, item) => {
    const { category } = item;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, PublicMenuItem[]>);

  return groupedMenu;
}
