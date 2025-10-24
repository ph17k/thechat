import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'

console.log('Hello from Functions!')

Deno.serve(async (req) => {
  const { query } = await req.json()
  const apiKey = Deno.env.get('PUBLICAI_KEY')
  const openai = new OpenAI({
    baseURL: 'https://api.publicai.co/v1/chat/completions',
    apiKey: apiKey,
  })

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: query }],
    model: 'swiss-ai/apertus-8b-instruct',
    stream: false,
  })

  const response = completion.choices[0].message.content
  const data = { response }
  return new Response(
    JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  })
})
