'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { TaskInstructions, DropdownOption, PhotoGuideline } from '@/types/addTask';
import { TASK_VALIDATION_RULES } from '@/config/wsConfig';
import { LazyImageSimple } from '@/components/ui/LazyImage';

const MAX_PHOTOS = TASK_VALIDATION_RULES.photoGuidelines.maxPhotos; // 20

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
  const photoGridRef = useRef<HTMLDivElement>(null);
  const [uploadingSlotIndex, setUploadingSlotIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Calculate number of visible slots: photos count + 1 empty slot (if not at max)
  const visibleSlots = Math.min(data.photoGuidelines.length + 1, MAX_PHOTOS);

  const handleChange = (field: keyof TaskInstructions, value: string) => {
    if (disabled) return;
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    if (disabled) return;
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0]; // Only take first file for single slot upload

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(`File ${file.name} exceeds 5MB limit`);
      return;
    }

    // Check file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert(`File ${file.name} must be JPG or PNG`);
      return;
    }

    const newPhoto: PhotoGuideline = {
      id: `photo-${Date.now()}`,
      url: URL.createObjectURL(file),
      file,
    };

    // Insert photo at the correct position
    const newPhotos = [...data.photoGuidelines];
    if (slotIndex < newPhotos.length) {
      // Replace existing slot
      newPhotos[slotIndex] = newPhoto;
    } else {
      // Add new photo
      newPhotos.push(newPhoto);
    }

    onChange({
      ...data,
      photoGuidelines: newPhotos,
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setUploadingSlotIndex(null);
  };

  const handleRemovePhoto = (photoId: string) => {
    if (disabled) return;
    onChange({
      ...data,
      photoGuidelines: data.photoGuidelines.filter((p) => p.id !== photoId),
    });
  };

  const handleSlotClick = (index: number) => {
    if (disabled) return;
    setUploadingSlotIndex(index);
    fileInputRef.current?.click();
  };

  // Process image file (shared by upload, paste, and drag-drop)
  const processImageFile = useCallback((file: File): PhotoGuideline | null => {
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(`File ${file.name || 'pasted image'} exceeds 5MB limit`);
      return null;
    }

    // Check file type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert(`File ${file.name || 'pasted image'} must be JPG or PNG`);
      return null;
    }

    return {
      id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      url: URL.createObjectURL(file),
      file,
    };
  }, []);

  // Add photo to the list
  const addPhoto = useCallback((newPhoto: PhotoGuideline) => {
    if (data.photoGuidelines.length >= MAX_PHOTOS) {
      alert(`Maximum ${MAX_PHOTOS} photos allowed`);
      return;
    }

    onChange({
      ...data,
      photoGuidelines: [...data.photoGuidelines, newPhoto],
    });
  }, [data, onChange]);

  // Handle paste event (Ctrl+V)
  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (disabled || data.taskType !== 'image') return;

    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const newPhoto = processImageFile(file);
          if (newPhoto) {
            addPhoto(newPhoto);
          }
        }
        break;
      }
    }
  }, [disabled, data.taskType, processImageFile, addPhoto]);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (disabled || data.taskType !== 'image') return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, [disabled, data.taskType]);

  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    if (disabled || data.taskType !== 'image') return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    // Process all dropped image files
    for (let i = 0; i < files.length; i++) {
      if (data.photoGuidelines.length + i >= MAX_PHOTOS) {
        alert(`Maximum ${MAX_PHOTOS} photos allowed. Only first ${MAX_PHOTOS - data.photoGuidelines.length} images were added.`);
        break;
      }
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const newPhoto = processImageFile(file);
        if (newPhoto) {
          addPhoto(newPhoto);
        }
      }
    }
  }, [disabled, data.taskType, data.photoGuidelines.length, processImageFile, addPhoto]);

  // Listen for paste events when Photo Guidelines section is visible
  useEffect(() => {
    if (data.taskType !== 'image' || disabled) return;

    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [data.taskType, disabled, handlePaste]);

  return (
    <div className="space-y-4">
      {/* 1. Task Type */}
      <div>
        <label htmlFor="instructionTaskType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          1. Task Type <span className="text-red-500">*</span>
        </label>
        <select
          id="instructionTaskType"
          value={data.taskType}
          onChange={(e) => handleChange('taskType', e.target.value)}
          disabled={disabled}
          data-field="instructionTaskType"
          aria-invalid={errors.taskType ? 'true' : 'false'}
          aria-describedby={errors.taskType ? 'instructionTaskType-error' : undefined}
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
          <p id="instructionTaskType-error" className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.taskType}
          </p>
        )}
      </div>

      {/* 2. Manual Link */}
      <div>
        <label htmlFor="manualLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          2. Manual Link <span className="text-red-500">*</span>
        </label>
        <input
          id="manualLink"
          type="url"
          value={data.manualLink}
          onChange={(e) => handleChange('manualLink', e.target.value)}
          placeholder="Paste link"
          disabled={disabled}
          data-field="manualLink"
          aria-invalid={errors.manualLink ? 'true' : 'false'}
          aria-describedby={errors.manualLink ? 'manualLink-error' : undefined}
          className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.manualLink
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.manualLink && (
          <p id="manualLink-error" className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.manualLink}
          </p>
        )}
      </div>

      {/* 3. Note */}
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          3. Note {data.taskType === 'document' && <span className="text-red-500">*</span>}
        </label>
        <textarea
          id="note"
          value={data.note}
          onChange={(e) => handleChange('note', e.target.value)}
          placeholder="Please attach the report file in the comment section after completing the task."
          rows={3}
          disabled={disabled}
          data-field="note"
          aria-invalid={errors.note ? 'true' : 'false'}
          aria-describedby={errors.note ? 'note-error' : undefined}
          className={`w-full px-3 py-2.5 bg-white dark:bg-gray-800 border rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
            errors.note
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600'
          }`}
        />
        {errors.note && (
          <p id="note-error" className="mt-1 text-xs text-red-500 flex items-center gap-1" role="alert">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.note}
          </p>
        )}
      </div>

      {/* 4. Photo Guidelines - Only show when Task Type is Image */}
      {data.taskType === 'image' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            4. Photo Guidelines <span className="text-red-500">*</span>
            <span className="ml-2 text-xs text-gray-400 font-normal">
              ({data.photoGuidelines.length}/{MAX_PHOTOS})
            </span>
          </label>

          {/* Error message */}
          {errors.photoGuidelines && (
            <p id="photoGuidelines-error" className="mb-2 text-xs text-red-500 flex items-center gap-1" role="alert">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.photoGuidelines}
            </p>
          )}

          {/* Photo Grid - Dynamic slots with drag-drop support */}
          <div
            ref={photoGridRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`grid grid-cols-2 gap-3 relative ${errors.photoGuidelines ? 'ring-2 ring-red-500 rounded-lg p-1' : ''} ${isDragOver ? 'ring-2 ring-pink-500 bg-pink-50 dark:bg-pink-900/20' : ''}`}
          >
            {/* Drag overlay */}
            {isDragOver && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-pink-100/80 dark:bg-pink-900/80 rounded-lg border-2 border-dashed border-pink-500">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto text-pink-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Drop images here</p>
                </div>
              </div>
            )}

            {/* Render photo slots */}
            {Array.from({ length: visibleSlots }).map((_, index) => {
              const photo = data.photoGuidelines[index];
              const isLastEmptySlot = index === data.photoGuidelines.length && index < MAX_PHOTOS;

              if (photo) {
                // Photo slot with image
                return (
                  <div
                    key={photo.id}
                    className="relative border-2 border-dashed border-pink-300 dark:border-pink-600 rounded-lg p-3 bg-pink-50/50 dark:bg-pink-900/10"
                  >
                    {/* Image preview */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 mb-2 rounded overflow-hidden">
                        <LazyImageSimple
                          src={photo.url}
                          alt="Photo guideline"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-pink-600 dark:text-pink-400 font-medium text-center">
                        Image {index + 1}
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

              // Empty upload slot
              return (
                <button
                  key={`empty-${index}`}
                  onClick={() => handleSlotClick(index)}
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
                      Image {index + 1}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Click, paste or drag</p>
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
            onChange={(e) => handlePhotoUpload(e, uploadingSlotIndex ?? data.photoGuidelines.length)}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
