'use client';

interface TaskGroupStatistics {
  total: number;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  other: number;
}

interface TaskGroupsStatisticsProps {
  statistics: TaskGroupStatistics;
}

export default function TaskGroupsStatistics({
  statistics,
}: TaskGroupsStatisticsProps) {
  const items = [
    {
      icon: (
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
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      ),
      label: 'Tong so Task:',
      value: statistics.total,
      iconColor: 'text-gray-500',
      valueColor: 'text-gray-900 dark:text-white',
    },
    {
      icon: (
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
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      label: 'Daily Task:',
      value: statistics.daily,
      iconColor: 'text-orange-500',
      valueColor: 'text-orange-600 dark:text-orange-400',
    },
    {
      icon: (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      label: 'Weekly:',
      value: statistics.weekly,
      iconColor: 'text-green-500',
      valueColor: 'text-green-600 dark:text-green-400',
    },
    {
      icon: (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      label: 'Monthly:',
      value: statistics.monthly,
      iconColor: 'text-blue-500',
      valueColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      icon: (
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      label: 'Yearly:',
      value: statistics.yearly,
      iconColor: 'text-purple-500',
      valueColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      icon: (
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
        </svg>
      ),
      label: 'Khac:',
      value: statistics.other,
      iconColor: 'text-cyan-500',
      valueColor: 'text-cyan-600 dark:text-cyan-400',
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm"
          >
            <span className={item.iconColor}>{item.icon}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {item.label}
            </span>
            <span className={`text-lg font-bold ${item.valueColor}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
