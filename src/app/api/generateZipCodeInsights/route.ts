import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_OPENAI_API_KEY,
});

/**
 * POST Handler for generating tax insights from GPT-3.5
 * Expects:
 * - taxData: Array of objects containing "gross-income" and "returns"
 */
export async function POST(req: Request) {
  try {
    const { taxData } = await req.json();

    if (!taxData || !Array.isArray(taxData)) {
      return NextResponse.json({ error: 'Invalid tax data format' }, { status: 400 });
    }

    // Format the data for better readability in the prompt
    const formattedData = taxData
      .map(
        (entry, index) =>
          `${index + 1}. ${entry['gross-income']}: ${entry.returns} returns`
      )
      .join('\n');

    // Constructing the prompt for OpenAI
    const prompt = `
      Here is the tax data for analysis:
      ${taxData}
      This shows the number of people who filed income tax in a particular area, for different income brackets over a few years.
      I am a senior director, and I would like high level insights with some color and bolded text.
      Dont say shit like "consider" etc, I want prompt responses that are professional and to the point.
      Show data in numbers, make text bold, showing the percentage changes over time.
      Limit your response to 3-4 sentences, and make it easy to read.
    `;

    // Sending request to OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a financial data analyst.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
    });

    const insights = response.choices[0].message.content;

    // Return formatted response
    return NextResponse.json({ insights }, { status: 200 });

  } catch (error: any) {
    console.error('Error generating insights:', error.message);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}

