import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_OPENAI_API_KEY,
});

export const POST = async (req: Request) => {
  try {
    const { districtId, voterCount } = await req.json();

    if (!districtId || !voterCount) {
      return new Response(JSON.stringify({ error: 'District ID and Voter Count are required' }), {
        status: 400,
      });
    }

    const prompt = `District: ${districtId}, Voters: ${voterCount}.
Generate insights based on voter turnout, compare with neighboring districts, and account for geographical or demographic factors if available.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    const insights = response.choices[0].message.content?.trim();
    return new Response(JSON.stringify({ insights }), {
      status: 200,
    });
  } catch (error: any) {
    console.error('OpenAI API error:', error?.message);
    return new Response(JSON.stringify({ error: 'Failed to generate insights' }), {
      status: 500,
    });
  }
};
