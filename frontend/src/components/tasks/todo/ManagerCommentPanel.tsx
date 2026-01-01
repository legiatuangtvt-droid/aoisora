'use client';

import { ManagerComment } from '@/types/todoTask';

interface ManagerCommentPanelProps {
  managerComments: ManagerComment[];
  otherComments: ManagerComment[];
  onAddManagerComment?: (content: string) => void;
  onAddOtherComment?: (content: string) => void;
}

export default function ManagerCommentPanel({
  managerComments,
  otherComments,
  onAddManagerComment,
  onAddOtherComment,
}: ManagerCommentPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Manager Comment Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          Manager Comment
          <span className="flex-1 h-0.5 bg-pink-200 dark:bg-pink-800" />
        </h3>

        {/* Existing Comments */}
        {managerComments.length > 0 && (
          <div className="space-y-2 mb-3">
            {managerComments.map((comment) => (
              <div key={comment.id} className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                <p>{comment.content}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  - {comment.author}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <textarea
          placeholder="Add manager comment..."
          className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              const value = (e.target as HTMLTextAreaElement).value.trim();
              if (value && onAddManagerComment) {
                onAddManagerComment(value);
                (e.target as HTMLTextAreaElement).value = '';
              }
            }
          }}
        />
      </div>

      {/* Other Comment Section */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          Other comment
          <span className="flex-1 h-0.5 bg-gray-200 dark:bg-gray-700" />
        </h3>

        {/* Existing Comments */}
        {otherComments.length > 0 && (
          <div className="space-y-2 mb-3">
            {otherComments.map((comment) => (
              <div key={comment.id} className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                <p>{comment.content}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  - {comment.author}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Input */}
        <textarea
          placeholder="Add other comment..."
          className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white"
          rows={3}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              const value = (e.target as HTMLTextAreaElement).value.trim();
              if (value && onAddOtherComment) {
                onAddOtherComment(value);
                (e.target as HTMLTextAreaElement).value = '';
              }
            }
          }}
        />
      </div>
    </div>
  );
}
