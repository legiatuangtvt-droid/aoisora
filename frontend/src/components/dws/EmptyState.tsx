'use client';

interface EmptyStateProps {
  type: 'no-data' | 'no-results' | 'error';
  title?: string;
  description?: string;
  searchQuery?: string;
  onClearSearch?: () => void;
  onAddNew?: () => void;
}

export default function EmptyState({
  type,
  title,
  description,
  searchQuery,
  onClearSearch,
  onAddNew,
}: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'no-data':
        return {
          icon: (
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          ),
          title: title || 'No tasks yet',
          description:
            description ||
            'Get started by creating your first RE Task. Click the button below to add one.',
          showAddButton: true,
        };
      case 'no-results':
        return {
          icon: (
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          ),
          title: title || 'No results found',
          description:
            description ||
            `No tasks match your search "${searchQuery}". Try adjusting your search terms.`,
          showClearButton: true,
        };
      case 'error':
        return {
          icon: (
            <svg
              className="w-12 h-12 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          ),
          title: title || 'Something went wrong',
          description:
            description ||
            'An error occurred while loading the tasks. Please try again.',
          showRetryButton: true,
        };
      default:
        return {
          icon: null,
          title: '',
          description: '',
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* Icon */}
      <div className="mb-4 p-4 rounded-full bg-gray-100 dark:bg-gray-700/50">
        {content.icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {content.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
        {content.description}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {content.showClearButton && onClearSearch && (
          <button
            onClick={onClearSearch}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear Search
          </button>
        )}

        {content.showAddButton && onAddNew && (
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#C5055B] hover:bg-[#A50449] rounded-lg transition-colors"
          >
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
            Add New Task
          </button>
        )}

        {content.showRetryButton && (
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
