'use server';

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface TaxData {
  state_name: string;
  total: number;
}

export async function fetchTaxData(): Promise<TaxData[]> {
  try {
    // Get the absolute path to the CSV file
    const csvPath = path.join(process.cwd(), 'src/data/country-level-income-tax.csv');
    
    // Read the CSV file
    const fileContent = fs.readFileSync(csvPath, 'utf-8');
    
    // Parse the CSV content
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    
    // Transform the data to match our interface
    const taxData: TaxData[] = records.map((record: any) => ({
      state_name: record.state_name,
      total: parseFloat(record.total),
    }));
    
    return taxData;
  } catch (error) {
    console.error('Error fetching tax data:', error);
    throw new Error('Failed to fetch tax data');
  }
} 