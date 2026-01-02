'use client';

interface DateSeparatorProps {
  date: string;
}

export default function DateSeparator({ date }: DateSeparatorProps) {
  return (
    <div className="flex items-center justify-center my-4">
      <span className="bg-pink-500 text-white text-xs font-medium px-4 py-1 rounded-full">
        {date}
      </span>
    </div>
  );
}
