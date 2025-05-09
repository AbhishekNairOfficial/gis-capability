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

    const prompt = `King County Washington, District: ${districtId}, Voters: ${voterCount}.
Generate some insights about the district and why the vote count is what it is. Be consise and answer in 1-2 sentences.`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
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
