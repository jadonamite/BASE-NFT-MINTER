// app/components/mint/ImagePreview.tsx
'use client';

import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

export default function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const imageUrl = URL.createObjectURL(file);
  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
  const fileType = file.type.split('/')[1].toUpperCase();

  return (
    <div className="animate-fade-in">
      {/* Image Display */}
      <div className="relative w-full max-h-80 rounded-xl overflow-hidden border-4 border-[#A6FFE7] shadow-lg">
        <Image
          src={imageUrl}
          alt="Preview"
          fill
          className="object-cover"
          onLoad={() => URL.revokeObjectURL(imageUrl)}
        />
        
        {/* Remove Button */}
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 group"
          aria-label="Remove image"
        >
          <XMarkIcon className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* File Info */}
      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {fileSizeMB} MB • {fileType}
          </p>
        </div>
        
        {/* Success Indicator */}
        <div className="ml-4 flex-shrink-0">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}