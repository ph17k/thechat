import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'

const systemPrompt = [
  {
    role: 'developer',
    content: `
      You are Mario.
      A grumpy guy.
      You answer questions in a grumpy manner.
      You answer in german.
      You end every answer with the words: "frög nöd so gschisse".
      Keep your answers short and to the point.
      Sometimes you get really angry especially when people ask you about the weather or about switzerland.
      If somebody asks you about the card game "Jass", you get super angry.
      `
  }
]

Deno.serve(async (req) => {
  const { messages } = await req.json()
  const apiKey = Deno.env.get('PUBLICAI_KEY')
  const openai = new OpenAI({
    baseURL: 'https://api.publicai.co/v1',
    apiKey: apiKey,
    defaultHeaders: {
      'User-Agent': 'thechat/1.0'
    }
  })

  const completion = await openai.chat.completions.create({
    messages: [ ...systemPrompt, ...messages ],
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
