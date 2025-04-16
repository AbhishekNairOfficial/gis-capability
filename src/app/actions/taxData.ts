'use server';

import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';

interface TaxData {
  state_name: string;
  total: number;
}

export async function fetchTaxData(): Promise<TaxData[]> {
  try {
    // Read the CSV file from the public directory
    const csvPath = path.join(process.cwd(), 'public/data/country-level-income-tax.csv');
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse the CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });
    
    // Transform the records into the desired format
    return records.map((record: any) => ({
      state_name: record.state_name,
      total: parseFloat(record.total)
    }));
  } catch (error) {
    console.error('Error reading tax data:', error);
    throw error;
  }
} 