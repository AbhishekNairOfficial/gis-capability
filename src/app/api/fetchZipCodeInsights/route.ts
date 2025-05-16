import { createClient } from '@supabase/supabase-js';

export const POST = async (req: Request) => {
  const { zipCode } = await req.json();

  // Log the environment variables (without the actual key)
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Supabase Key exists:', !!process.env.NEXT_SUPABASE_ANON_KEY);

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_SUPABASE_ANON_KEY!
  );

  try {
    // Query the table for matching zip codes
    const { data, error } = await supabase
      .from('zipcode-data-2022')
      .select('gross-income, returns')
      .eq('zip-code', zipCode)
      .not('gross-income', 'is', null)
      .not('gross-income', 'eq', '');

    if (error) {
      console.error('Error in zip code query:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    // Log the query results for debugging
    console.log('Query results:', { zipCode, data });

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
}