import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'
import { createOpenAI } from 'npm:@ai-sdk/openai'
import { convertToModelMessages, streamText } from 'npm:ai'

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

  const openai = createOpenAI({
    baseURL: "https://api.publicai.co/v1",
    apiKey: Deno.env.get('PUBLICAI_KEY')
  })

  const result = streamText({
    model: openai.chat('swiss-ai/apertus-8b-instruct'),
    messages: convertToModelMessages(messages),
    system: systemPrompt[0].content,
  })

  return result.toUIMessageStreamResponse()
})
