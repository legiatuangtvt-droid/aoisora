'use client';

interface StoreWeeklyData {
  storeName: string;
  weeks: {
    week: string;
    completionPercent: number;
  }[];
}

interface WeeklyCompletionGridProps {
  data: StoreWeeklyData[];
  weeks: string[];
}

// Get background color based on completion percentage
function getCompletionColor(percent: number): string {
  if (percent >= 100) return 'bg-green-500 text-white';
  if (percent >= 90) return 'bg-green-400 text-white';
  if (percent >= 80) return 'bg-yellow-400 text-gray-900';
  if (percent >= 70) return 'bg-orange-400 text-white';
  return 'bg-red-500 text-white';
}

export default function WeeklyCompletionGrid({ data, weeks }: WeeklyCompletionGridProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-600 border-b border-gray-200">
              Week
            </th>
            {weeks.map((week) => (
              <th
                key={week}
                className="px-3 py-2 text-center font-medium text-gray-600 border-b border-gray-200"
              >
                {week}
              </th>
            ))}
          </tr>
          <tr>
            <th className="px-3 py-2 text-left font-medium text-gray-600 border-b border-gray-200">
              Store
            </th>
            {weeks.map((week) => (
              <th key={`empty-${week}`} className="border-b border-gray-200"></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((store, index) => (
            <tr key={store.storeName} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-3 py-2 font-medium text-gray-900 border-b border-gray-100">
                {store.storeName}
              </td>
              {store.weeks.map((weekData) => (
                <td
                  key={`${store.storeName}-${weekData.week}`}
                  className="px-1 py-1 text-center border-b border-gray-100"
                >
                  <div
                    className={`px-2 py-1 rounded text-xs font-semibold ${getCompletionColor(
                      weekData.completionPercent
                    )}`}
                  >
                    {weekData.completionPercent}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
