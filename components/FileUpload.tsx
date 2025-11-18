'use client';
import { useState } from 'react';

export default function FileUpload({ onUploadSuccess }: any) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.documentId) {
        onUploadSuccess(data.documentId);
        alert(`✅ ${file.name} uploaded successfully!`);
      } else {
        throw new Error('No document ID returned');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('❌ Upload failed. Check console for details.');
      setFileName('');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-all'>
      <input
        type='file'
        accept='.pdf,.csv'
        onChange={handleUpload}
        disabled={uploading}
        className='hidden'
        id='file-upload'
      />
      <label htmlFor='file-upload' className='cursor-pointer block'>
        {fileName ? (
          <div>
            <div className='text-5xl mb-4'>✅</div>
            <p className='text-xl font-bold text-green-400 mb-2'>{fileName}</p>
            <p className='text-sm text-gray-500'>Click to upload another file</p>
          </div>
        ) : (
          <div>
            <div className='text-5xl mb-4'>📄</div>
            <p className='text-lg font-semibold'>
              {uploading ? 'Uploading...' : 'Click to upload PDF or CSV'}
            </p>
            <p className='text-sm text-gray-500 mt-2'>Supports .pdf and .csv files</p>
          </div>
        )}
      </label>
    </div>
  );
}
