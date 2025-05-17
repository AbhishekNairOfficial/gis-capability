import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_OPENAI_API_KEY,
});

export const POST = async (req: Request) => {
  const { zipCode } = await req.json();

  // Log the environment variables (without the actual key)
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  try {
    // Query both tables for matching zip codes
    const [data2021, data2022] = await Promise.all([
      supabase
        .from('zipcode-data-2021')
        .select('gross-income, returns')
        .eq('zip-code', zipCode)
        .not('gross-income', 'is', null)
        .not('gross-income', 'eq', ''),
      supabase
        .from('zipcode-data-2022')
        .select('gross-income, returns')
        .eq('zip-code', zipCode)
        .not('gross-income', 'is', null)
        .not('gross-income', 'eq', '')
    ]);

    if (data2021.error) {
      console.error('Error in 2021 zip code query:', data2021.error);
      return new Response(JSON.stringify({ error: data2021.error.message }), { status: 500 });
    }

    if (data2022.error) {
      console.error('Error in 2022 zip code query:', data2022.error);
      return new Response(JSON.stringify({ error: data2022.error.message }), { status: 500 });
    }

    const generatePrompt = `
    Analyze the following income tax return data for insights on income distribution, changes over the years, and any significant trends:
    
    **2021 Data:** 
    ${JSON.stringify(data2021, null, 2)}
    
    **2022 Data:** 
    ${JSON.stringify(data2022, null, 2)}
    
    Provide a structured analysis highlighting:
    1. Year-over-year changes in each income bracket.
    2. Any significant trends observed (growth or decline in certain brackets).
    3. Shifts in income distribution.
    4. Economic or demographic observations based on the data.
    5. Recommendations for further analysis if needed.
    `;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: 'system',
            content: 'You are a data analyst specializing in tax and income data analysis.'
          },
          {
            role: 'user',
            content: generatePrompt,
          }
        ],
        max_tokens: 150,
        temperature: 0.3,
      });

      const insights = response.choices[0].message.content?.trim();
      return new Response(JSON.stringify({ insights }), {
        status: 200,
      });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Unexpected error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), { status: 500 });
  }
}