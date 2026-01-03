'use client';

interface WeeklyCompletion {
  week: string;
  completed: number;
  incomplete: number;
  total: number;
}

interface StackedBarChartProps {
  data: WeeklyCompletion[];
}

export default function StackedBarChart({ data }: StackedBarChartProps) {
  // Find max total for scaling
  const maxTotal = Math.max(...data.map((d) => d.total), 1);
  const chartHeight = 200;

  return (
    <div className="w-full">
      <div className="flex items-end justify-around gap-4" style={{ height: chartHeight }}>
        {data.map((item) => {
          const totalHeight = (item.total / maxTotal) * chartHeight;
          const completedHeight = (item.completed / item.total) * totalHeight || 0;
          const incompleteHeight = (item.incomplete / item.total) * totalHeight || 0;

          return (
            <div key={item.week} className="flex flex-col items-center">
              {/* Bar */}
              <div
                className="w-16 flex flex-col-reverse rounded-t overflow-hidden"
                style={{ height: totalHeight }}
              >
                {/* Completed (Blue) - Bottom */}
                {item.completed > 0 && (
                  <div
                    className="w-full bg-blue-500 flex items-center justify-center"
                    style={{ height: completedHeight }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {item.completed}
                    </span>
                  </div>
                )}
                {/* Incomplete (Red) - Top */}
                {item.incomplete > 0 && (
                  <div
                    className="w-full bg-red-500 flex items-center justify-center"
                    style={{ height: incompleteHeight }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {item.incomplete}
                    </span>
                  </div>
                )}
              </div>
              {/* Week Label */}
              <div className="mt-2 text-sm font-medium text-gray-600">{item.week}</div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-sm text-gray-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-sm text-gray-600">Incomplete</span>
        </div>
      </div>
    </div>
  );
}
