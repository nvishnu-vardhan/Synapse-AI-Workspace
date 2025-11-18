'use client';
import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const [documentId, setDocumentId] = useState<string | null>(null);

  return (
    <main className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent'>
          Synapse AI Workspace
        </h1>
        <p className='text-gray-400 mb-8'>Intelligent document processing with AI-powered insights</p>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div>
            <h2 className='text-2xl font-semibold mb-4'>?? Upload Document</h2>
            <FileUpload onUploadSuccess={(id: string) => setDocumentId(id)} />
            {documentId && (
              <p className='mt-4 text-green-400'>? Document uploaded successfully! Start chatting below.</p>
            )}
          </div>

          <div>
            <h2 className='text-2xl font-semibold mb-4'>?? Chat with AI</h2>
            {documentId ? (
              <ChatInterface documentId={documentId} />
            ) : (
              <div className='border border-gray-700 rounded-lg p-8 text-center text-gray-500'>
                Upload a document first to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
