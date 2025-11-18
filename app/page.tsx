'use client';
import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  return (
    <main className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent'>
          Synapse AI Workspace
        </h1>
        <p className='text-gray-400 mb-8'>Intelligent document processing with AI-powered insights</p>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div>
            <h2 className='text-2xl font-semibold mb-4'>📄 Upload Document</h2>
            <FileUpload 
              onUploadSuccess={(id: string) => {
                setDocumentId(id);
                // You can get fileName from the component or API response
              }} 
            />
            {fileName && (
              <div className='mt-4 p-3 bg-green-900/30 border border-green-500 rounded-lg'>
                <p className='text-green-400'>✅ Uploaded: {fileName}</p>
              </div>
            )}
          </div>

          <div>
            <h2 className='text-2xl font-semibold mb-4'>💬 Chat with AI</h2>
            <ChatInterface documentId={documentId} />
          </div>
        </div>
      </div>
    </main>
  );
}

