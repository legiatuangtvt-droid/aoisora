'use client';

import { useState, useEffect, useRef } from 'react';
import {
  RETask,
  RE_TASK_GROUPS,
  RE_TASK_TYPES,
  FREQUENCY_TYPES,
} from '@/types/reTask';

interface AddRETaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<RETask, 'id'>) => void;
}

export default function AddRETaskModal({
  isOpen,
  onClose,
  onAdd,
}: AddRETaskModalProps) {
  const [formData, setFormData] = useState({
    group: '',
    taskName: '',
    typeTask: 'Product',
    frequencyType: 'Daily',
    frequencyNumber: '1',
    reUnit: '',
    manualLink: '',
    manualNumber: '',
    note: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const taskNameRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus on task name input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        taskNameRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'taskName':
        if (!formData.taskName.trim()) {
          newErrors.taskName = 'Task Name is required';
        } else if (formData.taskName.length < 3) {
          newErrors.taskName = 'Task Name must be at least 3 characters';
        } else {
          delete newErrors.taskName;
        }
        break;
      case 'group':
        if (!formData.group) {
          newErrors.group = 'Please select a group';
        } else {
          delete newErrors.group;
        }
        break;
      case 'reUnit':
        if (formData.reUnit && parseFloat(formData.reUnit) < 0) {
          newErrors.reUnit = 'RE Unit must be positive';
        } else {
          delete newErrors.reUnit;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.taskName.trim()) {
      newErrors.taskName = 'Task Name is required';
    } else if (formData.taskName.length < 3) {
      newErrors.taskName = 'Task Name must be at least 3 characters';
    }

    if (!formData.group) {
      newErrors.group = 'Please select a group';
    }

    if (formData.reUnit && parseFloat(formData.reUnit) < 0) {
      newErrors.reUnit = 'RE Unit must be positive';
    }

    setErrors(newErrors);
    setTouched({
      taskName: true,
      group: true,
      reUnit: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const newTask: Omit<RETask, 'id'> = {
      group: formData.group,
      taskName: formData.taskName.trim(),
      typeTask: formData.typeTask || 'Product',
      frequencyType: formData.frequencyType || 'Daily',
      frequencyNumber: parseInt(formData.frequencyNumber) || 1,
      reUnit: parseFloat(formData.reUnit) || 0,
      manualLink: formData.manualLink.trim() || undefined,
      manualNumber: formData.manualNumber.trim() || '',
      note: formData.note.trim() || undefined,
    };

    onAdd(newTask);
    setIsSubmitting(false);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      group: '',
      taskName: '',
      typeTask: 'Product',
      frequencyType: 'Daily',
      frequencyNumber: '1',
      reUnit: '',
      manualLink: '',
      manualNumber: '',
      note: '',
    });
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    onClose();
  };

  // Get group color for preview
  const getGroupColor = (groupId: string) => {
    const group = RE_TASK_GROUPS.find((g) => g.id === groupId);
    return group || { color: '#6B7280', bgColor: '#F3F4F6', name: '' };
  };

  if (!isOpen) return null;

  const selectedGroup = getGroupColor(formData.group);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop with animation */}
        <div
          className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal with animation */}
        <div
          ref={modalRef}
          className="relative z-50 w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl transform transition-all"
        >
          {/* Header with gradient */}
          <div className="relative px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Add New RE Task
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-5">
              {/* Row 1: Group & Task Name */}
              <div className="grid grid-cols-2 gap-4">
                {/* Group */}
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Group<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="group"
                      value={formData.group}
                      onChange={handleChange}
                      onBlur={() => handleBlur('group')}
                      className={`w-full px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm appearance-none cursor-pointer transition-colors ${
                        errors.group && touched.group
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                      }`}
                    >
                      <option value="">Select Group</option>
                      {RE_TASK_GROUPS.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {errors.group && touched.group && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.group}
                    </p>
                  )}
                  {formData.group && (
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          backgroundColor: selectedGroup.bgColor,
                          color: selectedGroup.color,
                        }}
                      >
                        {selectedGroup.name || formData.group}
                      </span>
                    </div>
                  )}
                </div>

                {/* Task Name */}
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Task Name<span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={taskNameRef}
                    type="text"
                    name="taskName"
                    value={formData.taskName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('taskName')}
                    className={`w-full px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm transition-colors ${
                      errors.taskName && touched.taskName
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                    placeholder="Enter task name"
                  />
                  {errors.taskName && touched.taskName && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.taskName}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2: Type Task & Frequency Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    Type Task
                  </label>
                  <div className="relative">
                    <select
                      name="typeTask"
                      value={formData.typeTask}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm appearance-none cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      {RE_TASK_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type} ({type.charAt(0)})
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Frequency Type
                  </label>
                  <div className="relative">
                    <select
                      name="frequencyType"
                      value={formData.frequencyType}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm appearance-none cursor-pointer hover:border-gray-400 transition-colors"
                    >
                      {FREQUENCY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Row 3: Frequency Number & RE Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                    Frequency Number
                  </label>
                  <input
                    type="number"
                    name="frequencyNumber"
                    value={formData.frequencyNumber}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm hover:border-gray-400 transition-colors"
                    placeholder="1"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    RE Unit (min)
                  </label>
                  <input
                    type="number"
                    name="reUnit"
                    value={formData.reUnit}
                    onChange={handleChange}
                    onBlur={() => handleBlur('reUnit')}
                    min="0"
                    step="0.5"
                    className={`w-full px-3 py-2.5 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm transition-colors ${
                      errors.reUnit && touched.reUnit
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                    placeholder="0"
                  />
                  {errors.reUnit && touched.reUnit && (
                    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.reUnit}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 4: Manual Link & Manual Number */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                    Manual Link
                  </label>
                  <input
                    type="text"
                    name="manualLink"
                    value={formData.manualLink}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm hover:border-gray-400 transition-colors"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Manual Number
                  </label>
                  <input
                    type="text"
                    name="manualNumber"
                    value={formData.manualNumber}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm hover:border-gray-400 transition-colors"
                    placeholder="e.g., DEL-001"
                  />
                </div>
              </div>

              {/* Row 5: Note */}
              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Note
                </label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#6366F1] focus:border-transparent text-sm resize-none hover:border-gray-400 transition-colors"
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                <span className="text-red-500">*</span> Required fields
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5558E3] hover:to-[#7C4FE0] disabled:opacity-70 disabled:cursor-not-allowed rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add Task
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
