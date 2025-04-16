'use client';

import { useEffect, useState } from 'react';
import { fetchTaxData } from '../actions/taxData';

interface TaxData {
  state_name: string;
  total: number;
}

export default function TestTaxData() {
  const [taxData, setTaxData] = useState<TaxData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchTaxData();
        setTaxData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tax Data Test</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {taxData.map((item) => (
          <div key={item.state_name} className="bg-white p-4 rounded-lg shadow">
            <h2 className="font-semibold">{item.state_name}</h2>
            <p className="text-gray-600">Total: ${item.total.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 