import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Document from '@/models/Document';
import Chunk from '@/models/Chunk';
import { parsePDF } from '@/lib/pdfParser';
import { parseCSV } from '@/lib/csvParser';
import { semanticChunk, generateEmbedding } from '@/lib/semanticChunking';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let textContent = '';

    if (file.type === 'application/pdf') {
      textContent = await parsePDF(buffer);
    } else if (file.type === 'text/csv') {
      const csvText = buffer.toString('utf-8');
      const data = parseCSV(csvText);
      textContent = JSON.stringify(data, null, 2);
    } else {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const document = await Document.create({
      filename: file.name,
      fileType: file.type,
      metadata: { size: file.size },
    });

    const chunks = await semanticChunk(textContent);

    for (let i = 0; i < chunks.length; i++) {
      const embedding = await generateEmbedding(chunks[i]);
      await Chunk.create({
        documentId: document._id,
        content: chunks[i],
        embedding,
        metadata: { chunkIndex: i },
      });
    }

    await document.updateOne({ totalChunks: chunks.length });

    return NextResponse.json({
      success: true,
      documentId: document._id,
      chunks: chunks.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
