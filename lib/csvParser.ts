import Papa from 'papaparse';

export function parseCSV(text: string): any[] {
  const result = Papa.parse(text, { header: true, skipEmptyLines: true });
  return result.data;
}
