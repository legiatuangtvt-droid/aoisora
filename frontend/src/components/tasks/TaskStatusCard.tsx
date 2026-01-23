'use client';

import { TaskResultStatus, LikeInfo } from '@/types/tasks';
import { LazyImageSimple } from '@/components/ui/LazyImage';

interface TaskStatusCardProps {
  status: TaskResultStatus;
  linkUrl?: string;
  likes: LikeInfo;
  onLike?: () => void;
}

const STATUS_CONFIG: Record<TaskResultStatus, { label: string; badgeLabel: string; bgColor: string; borderColor: string; textColor: string; dotColor: string; badgeBg: string; badgeText: string }> = {
  success: {
    label: 'ĐÃ HOÀN THÀNH CÔNG VIỆC',
    badgeLabel: 'SUCCESS',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-l-4 border-teal-400',
    textColor: 'text-blue-600 dark:text-blue-400',
    dotColor: 'bg-teal-500',
    badgeBg: 'bg-white border border-teal-400',
    badgeText: 'text-teal-600',
  },
  failed: {
    label: 'KHÔNG HOÀN THÀNH CÔNG VIỆC',
    badgeLabel: 'FAILED',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    borderColor: 'border-l-4 border-orange-500',
    textColor: 'text-orange-700 dark:text-orange-400',
    dotColor: 'bg-orange-500',
    badgeBg: 'bg-white border border-orange-400',
    badgeText: 'text-orange-600',
  },
  in_progress: {
    label: 'CHƯA HOÀN THÀNH CÔNG VIỆC',
    badgeLabel: 'IN PROCESS',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-l-4 border-yellow-500',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    dotColor: 'bg-yellow-500',
    badgeBg: 'bg-white border border-yellow-400',
    badgeText: 'text-yellow-600',
  },
  not_started: {
    label: 'CHƯA BẮT ĐẦU',
    badgeLabel: 'NOT STARTED',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    borderColor: 'border-l-4 border-gray-300 dark:border-gray-600',
    textColor: 'text-gray-700 dark:text-gray-400',
    dotColor: 'bg-gray-400',
    badgeBg: 'bg-white border border-gray-300',
    badgeText: 'text-gray-600',
  },
};

export default function TaskStatusCard({ status, linkUrl, likes, onLike }: TaskStatusCardProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className={`p-4 rounded-lg ${config.bgColor} ${config.borderColor}`}>
      <div className="flex items-center justify-between">
        {/* Status Info */}
        <div>
          {/* Status Badge with dot */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.badgeBg} ${config.badgeText}`}>
            <span className={`w-2 h-2 rounded-full ${config.dotColor}`}></span>
            {config.badgeLabel}
          </span>

          {/* Status Text */}
          <h3 className={`text-xl font-bold mt-2 ${config.textColor}`}>
            {config.label}
          </h3>

          {/* Link */}
          {linkUrl && (
            <a
              href={linkUrl}
              className="text-sm text-blue-500 hover:underline mt-1 inline-block"
            >
              Link báo cáo
            </a>
          )}
        </div>

        {/* Like Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLike}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="text-sm font-medium">Like</span>
          </button>

          {/* Like count and avatars */}
          {likes.count > 0 && (
            <div className="flex items-center gap-2">
              {/* User avatars */}
              <div className="flex -space-x-2">
                {likes.users.slice(0, 3).map((user) => (
                  <div
                    key={user.id}
                    className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white dark:border-gray-800 flex items-center justify-center overflow-hidden"
                    title={user.name}
                  >
                    {user.avatar ? (
                      <LazyImageSimple src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-600 text-xs font-medium">
                        {user.name.charAt(0)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {/* Count */}
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {likes.count} {likes.count === 1 ? 'like' : 'likes'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
