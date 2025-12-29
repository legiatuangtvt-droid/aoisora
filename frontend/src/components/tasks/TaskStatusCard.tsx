'use client';

import { TaskResultStatus, LikeInfo } from '@/types/tasks';

interface TaskStatusCardProps {
  status: TaskResultStatus;
  linkUrl?: string;
  likes: LikeInfo;
  onLike?: () => void;
}

const STATUS_CONFIG: Record<TaskResultStatus, { label: string; bgColor: string; borderColor: string; textColor: string }> = {
  success: {
    label: 'ĐÃ HOÀN THÀNH CÔNG VIỆC',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-500',
    textColor: 'text-green-700 dark:text-green-400',
  },
  failed: {
    label: 'KHÔNG HOÀN THÀNH CÔNG VIỆC',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-orange-500',
    textColor: 'text-orange-700 dark:text-orange-400',
  },
  in_progress: {
    label: 'CHƯA HOÀN THÀNH CÔNG VIỆC',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-700 dark:text-yellow-400',
  },
  not_started: {
    label: 'CHƯA BẮT ĐẦU',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    borderColor: 'border-gray-300 dark:border-gray-600',
    textColor: 'text-gray-700 dark:text-gray-400',
  },
};

export default function TaskStatusCard({ status, linkUrl, likes, onLike }: TaskStatusCardProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className={`p-4 rounded-lg border-l-4 ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-start justify-between">
        {/* Status Info */}
        <div>
          {/* Status Badge */}
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
            status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
            status === 'in_progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {status === 'success' ? 'SUCCESS' :
             status === 'failed' ? 'FAILED' :
             status === 'in_progress' ? 'IN PROCESS' : 'NOT STARTED'}
          </span>

          {/* Status Text */}
          <h3 className={`text-lg font-bold mt-2 ${config.textColor}`}>
            {config.label}
          </h3>

          {/* Link */}
          {linkUrl && (
            <a
              href={linkUrl}
              className="text-sm text-[#C5055B] hover:underline mt-1 inline-block"
            >
              Link báo cáo
            </a>
          )}
        </div>

        {/* Like Section */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLike}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-colors ${
              likes.count > 0
                ? 'border-pink-300 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
                : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-pink-300 hover:text-pink-600'
            }`}
          >
            <svg className="w-4 h-4" fill={likes.count > 0 ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-sm font-medium">Like</span>
          </button>

          {/* Like count and avatars */}
          {likes.count > 0 && (
            <div className="flex items-center">
              {/* User avatars */}
              <div className="flex -space-x-2">
                {likes.users.slice(0, 3).map((user, index) => (
                  <div
                    key={user.id}
                    className="w-6 h-6 rounded-full bg-pink-500 border-2 border-white dark:border-gray-800 flex items-center justify-center"
                    title={user.name}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white text-xs font-medium">
                        {user.name.charAt(0)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {/* Count */}
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                {likes.count} {likes.count === 1 ? 'like' : 'likes'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
