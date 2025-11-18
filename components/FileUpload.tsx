'use client';
import { useState } from 'react';

export default function FileUpload({ onUploadSuccess }: any) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      onUploadSuccess(data.documentId);
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='border-2 border-dashed border-gray-600 rounded-lg p-8 text-center'>
      <input
        type='file'
        accept='.pdf,.csv'
        onChange={handleUpload}
        disabled={uploading}
        className='hidden'
        id='file-upload'
      />
      <label htmlFor='file-upload' className='cursor-pointer'>
        <div className='text-4xl mb-4'>??</div>
        <p className='text-lg'>{uploading ? 'Uploading...' : 'Click to upload PDF or CSV'}</p>
      </label>
    </div>
  );
}
