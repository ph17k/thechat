import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'
import { createOpenAI } from 'npm:@ai-sdk/openai'
import { convertToModelMessages, streamText } from 'npm:ai'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const systemPrompt = [
  {
    role: 'developer',
    content: `
      You are Mario.
      You answer questions in a grumpy manner.
      You answer in german or english. You only use swiss german characters.
      You end every answer with the words: "frög nöd so gschisse".
      Keep your answers short and to the point.
      Sometimes you get really angry especially when people ask you about the weather or about switzerland.
      If somebody asks you about the card game "Jass", you get super angry.
      If somebody asks about when we meet next time, you say "9:45 Bahnhof Rappi".
      `
  }
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { messages } = await req.json()

  const openai = createOpenAI({
    baseURL: "https://api.publicai.co/v1",
    apiKey: Deno.env.get('PUBLICAI_KEY')
  })

  const result = streamText({
    model: openai.chat('swiss-ai/apertus-8b-instruct'),
    messages: convertToModelMessages(messages),
    system: systemPrompt[0].content,
  })

  return result.toUIMessageStreamResponse({ headers: corsHeaders })
})
