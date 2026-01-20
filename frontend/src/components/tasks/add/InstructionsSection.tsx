'use client';

import { useRef } from 'react';
import { TaskInstructions, DropdownOption, PhotoGuideline } from '@/types/addTask';

interface InstructionsSectionProps {
  data: TaskInstructions;
  onChange: (data: TaskInstructions) => void;
  taskTypeOptions: DropdownOption[];
  errors?: Record<string, string>;
  disabled?: boolean;
}

export default function InstructionsSection({
  data,
  onChange,
  taskTypeOptions,
  errors = {},
  disabled = false,
}: InstructionsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof TaskInstructions, value: string) => {
    if (disabled) return;
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const files = e.target.files;
    if (!files) return;

    const newPhotos: PhotoGuideline[] = [];
    const maxPhotos = 4 - data.photoGuidelines.length;

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
    if (disabled) return;
    onChange({
      ...data,
      photoGuidelines: data.photoGuidelines.filter((p) => p.id !== photoId),
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. Task Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          1. Task Type
        </label>
        <select
          value={data.taskType}
          onChange={(e) => handleChange('taskType', e.target.value)}
          disabled={disabled}
          className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.taskType
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        >
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

      {/* 2. Manual Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          2. Manual Link
        </label>
        <input
          type="url"
          value={data.manualLink}
          onChange={(e) => handleChange('manualLink', e.target.value)}
          placeholder="Paste link"
          disabled={disabled}
          className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.manualLink
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.manualLink && (
          <p className="mt-1 text-xs text-red-500">{errors.manualLink}</p>
        )}
      </div>

      {/* 3. Note */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          3. Note {data.taskType === 'document' && <span className="text-red-500">*</span>}
        </label>
        <textarea
          value={data.note}
          onChange={(e) => handleChange('note', e.target.value)}
          placeholder="Please attach the report file in the comment section after completing the task."
          rows={3}
          disabled={disabled}
          className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.note
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.note && (
          <p className="mt-1 text-xs text-red-500">{errors.note}</p>
        )}
      </div>

      {/* 4. Photo Guidelines - Only show when Task Type is NOT Image */}
      {data.taskType !== 'image' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            4. Photo Guidelines
          </label>

          {/* Error message */}
          {errors.photoGuidelines && (
            <p className="mb-2 text-xs text-red-500">{errors.photoGuidelines}</p>
          )}

          {/* Photo Grid 2x2 */}
          <div className={`grid grid-cols-2 gap-3 ${errors.photoGuidelines ? 'ring-2 ring-red-500 rounded-lg p-1' : ''}`}>
            {/* Photo slots */}
            {[0, 1, 2, 3].map((index) => {
              const photo = data.photoGuidelines[index];

              if (photo) {
                return (
                  <div
                    key={photo.id}
                    className="relative border-2 border-dashed border-pink-300 dark:border-pink-600 rounded-lg p-3 bg-pink-50/50 dark:bg-pink-900/10"
                  >
                    {/* Image preview */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 mb-2 rounded overflow-hidden">
                        <img
                          src={photo.url}
                          alt="Photo guideline"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-pink-600 dark:text-pink-400 font-medium text-center">
                        {index === 0 ? 'POS Area Image' : index === 1 ? 'PERI Area Image' : 'POS Area Image'}
                      </p>
                    </div>

                    {/* Image name input */}
                    <input
                      type="text"
                      placeholder="Enter image name"
                      disabled={disabled}
                      className="w-full mt-2 px-2 py-1 text-xs border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    {/* Remove button */}
                    {!disabled && (
                    <button
                      onClick={() => handleRemovePhoto(photo.id)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={index}
                  onClick={() => !disabled && fileInputRef.current?.click()}
                  disabled={disabled}
                  className={`border-2 border-dashed border-pink-300 dark:border-pink-600 rounded-lg p-4 bg-pink-50/50 dark:bg-pink-900/10 transition-colors ${
                    disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-pink-100/50 dark:hover:bg-pink-900/20'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 mb-2 text-pink-400">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs text-pink-600 dark:text-pink-400 font-medium">
                      {index === 0 ? 'POS Area Image' : index === 1 ? 'PERI Area Image' : 'POS Area Image'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Enter image name</p>
                  </div>
                </button>
              );
            })}
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
      )}
    </div>
  );
}
