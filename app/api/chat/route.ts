import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import connectDB from '@/lib/mongodb';
import Chunk from '@/models/Chunk';
import { generateEmbedding } from '@/lib/semanticChunking';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { message, documentId } = await request.json();

    const queryEmbedding = await generateEmbedding(message);

    const relevantChunks = await Chunk.find({ documentId })
      .limit(5)
      .lean();

    const context = relevantChunks.map((c) => c.content).join('\n\n');

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Use the provided context to answer questions accurately.',
        },
        { role: 'user', content: Context:\n\n\nQuestion:  },
      ],
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/event-stream' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
