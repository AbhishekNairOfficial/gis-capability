import { createClient } from '@supabase/supabase-js';

const YEARS = Array.from({ length: 2 }, (_, i) => 2021 + i); // 2021 to 2022

async function fetchYearData(supabase: any, year: number, zipcode: string) {
  const { data, error } = await supabase
    .from(`zipcode-data-${year}`)
    .select('gross-income, returns')
    .eq('zip-code', zipcode)
    .not('gross-income', 'is', null)
    .not('gross-income', 'eq', '');

  if (error) {
    console.error(`Error in ${year} zip code query:`, error);
    throw error;
  }

  const formattedData: any = { year };
  data.forEach((item: any) => {
    formattedData[item['gross-income']] = item['returns'];
  });

  return formattedData;
}

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  const zipcode = params.id;

  if (!zipcode) {
    return new Response(JSON.stringify({ error: 'Zipcode is required' }), { status: 400 });
  }

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_ANON_KEY!
  );

  try {
    // Fetch data for all years in parallel
    const formattedData = await Promise.all(
      YEARS.map(year => fetchYearData(supabase, year, zipcode))
    );

    return new Response(JSON.stringify(
      formattedData
    ), { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
};