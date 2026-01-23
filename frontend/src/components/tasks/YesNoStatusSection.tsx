'use client';

import { TaskResultStatus, LikeInfo } from '@/types/tasks';
import { LazyImageSimple } from '@/components/ui/LazyImage';

interface YesNoStatusSectionProps {
  status: TaskResultStatus;
  likes: LikeInfo;
  reportLink?: string;
  onLike?: () => void;
}

// Status config for display
const STATUS_CONFIG: Record<TaskResultStatus, { label: string; badgeText: string; badgeColor: string; dotColor: string }> = {
  success: {
    label: 'ĐÃ HOÀN THÀNH CÔNG VIỆC',
    badgeText: 'SUCCESS',
    badgeColor: 'bg-white border-green-400 text-green-600',
    dotColor: 'bg-green-500',
  },
  failed: {
    label: 'KHÔNG THỂ HOÀN THÀNH',
    badgeText: 'FAILED',
    badgeColor: 'bg-white border-red-400 text-red-600',
    dotColor: 'bg-red-500',
  },
  in_progress: {
    label: 'ĐANG THỰC HIỆN',
    badgeText: 'IN PROGRESS',
    badgeColor: 'bg-white border-yellow-400 text-yellow-600',
    dotColor: 'bg-yellow-500',
  },
  not_started: {
    label: 'CHƯA BẮT ĐẦU',
    badgeText: 'NOT STARTED',
    badgeColor: 'bg-white border-gray-400 text-gray-600',
    dotColor: 'bg-gray-400',
  },
};

export default function YesNoStatusSection({
  status,
  likes,
  reportLink,
  onLike,
}: YesNoStatusSectionProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        {/* Left - Status Info */}
        <div>
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${config.badgeColor}`}>
            <span className={`w-2 h-2 rounded-full ${config.dotColor}`}></span>
            {config.badgeText}
          </div>

          {/* Status Text */}
          <h3 className="text-xl font-bold text-blue-600 mt-2">
            {config.label}
          </h3>

          {/* Report Link */}
          {reportLink && (
            <a
              href={reportLink}
              className="text-sm text-blue-500 hover:underline mt-1 inline-block"
            >
              Link báo cáo
            </a>
          )}
        </div>

        {/* Right - Like Button and Avatars */}
        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            onClick={onLike}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-pink-50 hover:bg-pink-100 border border-pink-200 rounded-full text-pink-600 font-medium transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Like
          </button>

          {/* Like Avatars */}
          {likes.count > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {likes.users.slice(0, 3).map((user, index) => (
                  <div
                    key={user.id}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center overflow-hidden"
                    title={user.name}
                  >
                    {user.avatar ? (
                      <LazyImageSimple src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-medium text-gray-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {likes.count} like{likes.count > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
