import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  previewUrl: string | null;
  onClear: () => void;
  isProcessing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, previewUrl, onClear, isProcessing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!previewUrl ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={onDragOver}
          onDrop={onDrop}
          className="border-2 border-dashed border-premium-300 rounded-3xl p-6 md:p-12 text-center cursor-pointer hover:border-premium-500 transition-all bg-white/50 backdrop-blur-sm group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <div className="bg-premium-100 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
            <Upload className="text-premium-600 w-6 h-6 md:w-7 md:h-7" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-premium-800 mb-2">Upload Palatal Image</h3>
          <p className="text-premium-500">Drag and drop or click to browse</p>
          <p className="text-premium-400 text-sm mt-4">JPG, PNG supported</p>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden bg-premium-100 aspect-[4/3] flex items-center justify-center">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-full max-w-full object-contain"
          />
          {!isProcessing && (
            <button
              onClick={onClear}
              className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full hover:bg-white text-premium-700 transition-colors shadow-sm"
            >
              <X size={20} />
            </button>
          )}
          {isProcessing && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center p-4">
              <div className="bg-white p-4 md:p-6 rounded-3xl shadow-xl flex flex-col items-center gap-4 w-full max-w-[240px]">
                <Loader2 className="animate-spin text-premium-600" size={32} />
                <p className="font-medium text-premium-800">Enhancing Image...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
