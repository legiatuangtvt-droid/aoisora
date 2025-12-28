'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskStatus, HQCheckStatus } from '@/types/tasks';

interface NewTaskForm {
  taskGroupName: string;
  dept: string;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  subTasks: { name: string; assignee: string }[];
}

export default function NewTaskPage() {
  const router = useRouter();

  const [form, setForm] = useState<NewTaskForm>({
    taskGroupName: '',
    dept: '',
    startDate: '',
    endDate: '',
    status: 'NOT_YET',
    subTasks: [{ name: '', assignee: '' }],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = ['Marketing', 'Design', 'Development', 'Sales', 'HR', 'Finance'];

  const handleInputChange = (field: keyof NewTaskForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubTaskChange = (index: number, field: 'name' | 'assignee', value: string) => {
    const newSubTasks = [...form.subTasks];
    newSubTasks[index] = { ...newSubTasks[index], [field]: value };
    setForm((prev) => ({ ...prev, subTasks: newSubTasks }));
  };

  const addSubTask = () => {
    setForm((prev) => ({
      ...prev,
      subTasks: [...prev.subTasks, { name: '', assignee: '' }],
    }));
  };

  const removeSubTask = (index: number) => {
    if (form.subTasks.length > 1) {
      const newSubTasks = form.subTasks.filter((_, i) => i !== index);
      setForm((prev) => ({ ...prev, subTasks: newSubTasks }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Replace with actual API call
    console.log('Creating task:', form);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    router.push('/tasks/list');
  };

  const handleCancel = () => {
    router.push('/tasks/list');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to List
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-8">Create New Task</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Group Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.taskGroupName}
              onChange={(e) => handleInputChange('taskGroupName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter task group name"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              value={form.dept}
              onChange={(e) => handleInputChange('dept', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
              required
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleInputChange('status', e.target.value as TaskStatus)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
            >
              <option value="NOT_YET">Not Yet</option>
              <option value="DRAFT">Draft</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          {/* Sub Tasks */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Sub Tasks</label>
              <button
                type="button"
                onClick={addSubTask}
                className="flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700 font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Sub Task
              </button>
            </div>

            <div className="space-y-3">
              {form.subTasks.map((subTask, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                  <input
                    type="text"
                    value={subTask.name}
                    onChange={(e) => handleSubTaskChange(index, 'name', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Sub task name"
                  />
                  <input
                    type="text"
                    value={subTask.assignee}
                    onChange={(e) => handleSubTaskChange(index, 'assignee', e.target.value)}
                    className="w-40 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Assignee"
                  />
                  {form.subTasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubTask(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#C5055B' }}
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
