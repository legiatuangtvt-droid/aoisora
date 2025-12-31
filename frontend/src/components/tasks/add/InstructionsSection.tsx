'use client';

import { useRef } from 'react';
import { TaskInstructions, DropdownOption, PhotoGuideline } from '@/types/addTask';

interface InstructionsSectionProps {
  data: TaskInstructions;
  onChange: (data: TaskInstructions) => void;
  taskTypeOptions: DropdownOption[];
  errors?: Record<string, string>;
}

export default function InstructionsSection({
  data,
  onChange,
  taskTypeOptions,
  errors = {},
}: InstructionsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof TaskInstructions, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos: PhotoGuideline[] = [];
    const maxPhotos = 6 - data.photoGuidelines.length;

    for (let i = 0; i < Math.min(files.length, maxPhotos); i++) {
      const file = files[i];

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 5MB limit`);
        continue;
      }

      // Check file type
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert(`File ${file.name} must be JPG or PNG`);
        continue;
      }

      newPhotos.push({
        id: `photo-${Date.now()}-${i}`,
        url: URL.createObjectURL(file),
        file,
      });
    }

    onChange({
      ...data,
      photoGuidelines: [...data.photoGuidelines, ...newPhotos],
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (photoId: string) => {
    onChange({
      ...data,
      photoGuidelines: data.photoGuidelines.filter((p) => p.id !== photoId),
    });
  };

  return (
    <div className="space-y-4">
      {/* Task Type (Instruction) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Task Type <span className="text-red-500">*</span>
        </label>
        <select
          value={data.taskType}
          onChange={(e) => handleChange('taskType', e.target.value)}
          className={`w-full px-3 py-2 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 ${
            errors.taskType
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
          <option value="">Select task type</option>
          {taskTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.taskType && (
          <p className="mt-1 text-xs text-red-500">{errors.taskType}</p>
        )}
      </div>

      {/* Manual Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Manual Link
        </label>
        <input
          type="url"
          value={data.manualLink}
          onChange={(e) => handleChange('manualLink', e.target.value)}
          placeholder="https://example.com/manual"
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Note
        </label>
        <textarea
          value={data.note}
          onChange={(e) => handleChange('note', e.target.value)}
          placeholder="Enter detailed instructions..."
          rows={4}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
        />
      </div>

      {/* Photo Guidelines */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Photo Guidelines
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Max 6 images, each max 5MB (JPG/PNG)
        </p>

        {/* Photo Grid 2x3 */}
        <div className="grid grid-cols-3 gap-3">
          {/* Existing Photos */}
          {data.photoGuidelines.map((photo) => (
            <div
              key={photo.id}
              className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden group"
            >
              <img
                src={photo.url}
                alt="Photo guideline"
                className="w-full h-full object-cover"
              />
              {/* Remove Button */}
              <button
                onClick={() => handleRemovePhoto(photo.id)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Upload Progress */}
              {photo.uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-16 h-1 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-pink-500 transition-all"
                      style={{ width: `${photo.progress || 0}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Photo Button (if less than 6 photos) */}
          {data.photoGuidelines.length < 6 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add Photo</span>
            </button>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          multiple
          onChange={handlePhotoUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
