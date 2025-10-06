
import React, { useState, useCallback, DragEvent } from 'react';
import { UploadedFile } from '../types';
import { fileToBase64 } from '../utils/fileUtils';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  title: string;
  onFileSelect: (file: UploadedFile | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ title, onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const processFile = useCallback(async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setFileName(file.name);
      
      const base64 = await fileToBase64(file);
      onFileSelect({
        name: file.name,
        type: file.type,
        base64,
        preview: previewUrl
      });
    } else {
      // Basic error handling for non-image files
      alert('Please upload a valid image file (jpeg, png, etc.).');
    }
  }, [onFileSelect]);

  const handleDrag = (e: DragEvent<HTMLDivElement | HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // FIX: Updated the event type to be compatible with HTMLLabelElement.
  const handleDrop = (e: DragEvent<HTMLDivElement | HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };
  
  const handleRemove = () => {
    setPreview(null);
    setFileName('');
    onFileSelect(null);
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <h3 className="text-xl font-semibold mb-4 text-gray-300">{title}</h3>
      {preview ? (
        <div className="w-full h-64 relative border-2 border-dashed border-brand-gray-light rounded-lg flex items-center justify-center p-2">
            <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
            <button onClick={handleRemove} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm hover:bg-red-700 transition-colors">&times;</button>
        </div>
      ) : (
        <label
          htmlFor={`dropzone-file-${title.replace(/\s+/g, '-')}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            dragActive ? 'border-brand-yellow bg-brand-gray-light' : 'border-brand-gray-light bg-brand-gray hover:bg-brand-gray-light'
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP, etc.</p>
          </div>
          <input id={`dropzone-file-${title.replace(/\s+/g, '-')}`} type="file" className="hidden" onChange={handleChange} accept="image/*" />
        </label>
      )}
    </div>
  );
};
