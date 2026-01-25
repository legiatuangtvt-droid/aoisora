'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]',
    none: '',
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

// Skeleton for table rows
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-700">
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton height={20} className="w-full" />
        </td>
      ))}
    </tr>
  );
}

// Skeleton for cards
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton height={24} className="w-1/3" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} height={16} className={i === lines - 1 ? 'w-2/3' : 'w-full'} />
        ))}
      </div>
    </div>
  );
}

// Skeleton for the Todo Task page
export function TodoTaskPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Week Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton height={32} width={200} className="mb-2" />
          <Skeleton height={20} width={180} />
        </div>
        <Skeleton height={40} width={120} className="rounded-lg" />
      </div>

      {/* Overview Panels Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CardSkeleton lines={4} />
        <CardSkeleton lines={4} />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex gap-4">
        <Skeleton height={40} width={150} className="rounded-lg" />
        <Skeleton height={40} width={150} className="rounded-lg" />
        <Skeleton height={40} width={150} className="rounded-lg" />
      </div>

      {/* Calendar + Comments Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CardSkeleton lines={6} />
        </div>
        <div>
          <CardSkeleton lines={4} />
        </div>
      </div>
    </div>
  );
}

// Skeleton for Task List page - only table body (header/controls already visible)
export function TaskListPageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Table body skeleton only - header row is already rendered */}
      <div className="space-y-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center border-b border-gray-100 dark:border-gray-700 py-3 px-4"
          >
            {/* No column */}
            <div className="w-12 flex-shrink-0">
              <Skeleton height={16} width={20} />
            </div>
            {/* Dept + Avatar column */}
            <div className="w-24 flex-shrink-0 flex items-center gap-2">
              <Skeleton height={16} width={32} />
              <Skeleton variant="circular" width={28} height={28} />
            </div>
            {/* Task Group Name - flexible width */}
            <div className="flex-1 px-4">
              <Skeleton height={16} className="w-3/4" />
            </div>
            {/* Start→End */}
            <div className="w-32 flex-shrink-0 text-center">
              <Skeleton height={16} width={90} className="mx-auto" />
            </div>
            {/* Progress */}
            <div className="w-20 flex-shrink-0 text-center">
              <Skeleton height={16} width={40} className="mx-auto" />
            </div>
            {/* Unable */}
            <div className="w-16 flex-shrink-0 text-center">
              <Skeleton height={16} width={24} className="mx-auto" />
            </div>
            {/* Status pill */}
            <div className="w-24 flex-shrink-0 flex justify-center">
              <Skeleton height={24} width={70} className="rounded-full" />
            </div>
            {/* HQ Check pill */}
            <div className="w-28 flex-shrink-0 flex justify-center">
              <Skeleton height={24} width={65} className="rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton for Task Detail page
export function TaskDetailPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div>
            <Skeleton height={28} width={300} className="mb-2" />
            <Skeleton height={16} width={150} />
          </div>
        </div>
        <Skeleton height={36} width={100} className="rounded-lg" />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
          >
            <Skeleton height={16} width={80} className="mb-2" />
            <Skeleton height={32} width={60} />
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Info */}
        <div className="lg:col-span-2">
          <CardSkeleton lines={6} />
        </div>
        {/* Store Progress */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <Skeleton height={24} width={120} className="mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton height={16} width={120} />
                  <Skeleton height={24} width={80} className="rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <CardSkeleton lines={4} />
    </div>
  );
}

// Skeleton for Library page
export function LibraryPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton height={32} width={180} />
        <Skeleton height={40} width={140} className="rounded-lg" />
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Skeleton height={40} width={200} className="rounded-lg" />
        <Skeleton height={40} width={200} className="rounded-lg" />
      </div>

      {/* Library Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-3">
              <Skeleton height={20} width={180} />
              <Skeleton height={24} width={80} className="rounded-full" />
            </div>
            <Skeleton height={14} className="w-full mb-2" />
            <Skeleton height={14} className="w-3/4 mb-4" />
            <div className="flex items-center gap-2">
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton height={14} width={100} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton for Add Task page
export function AddTaskPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton height={28} width={200} />
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {/* Task Name */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <Skeleton height={20} width={100} className="mb-3" />
          <Skeleton height={44} className="w-full rounded-lg" />
        </div>

        {/* A. Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <Skeleton height={24} width={150} className="mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Skeleton height={16} width={80} className="mb-2" />
              <Skeleton height={44} className="w-full rounded-lg" />
            </div>
            <div>
              <Skeleton height={16} width={80} className="mb-2" />
              <Skeleton height={44} className="w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* B. Instructions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <Skeleton height={24} width={150} className="mb-4" />
          <div className="space-y-4">
            <div>
              <Skeleton height={16} width={100} className="mb-2" />
              <Skeleton height={44} className="w-full rounded-lg" />
            </div>
            <div>
              <Skeleton height={16} width={100} className="mb-2" />
              <Skeleton height={100} className="w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* C. Scope */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <Skeleton height={24} width={100} className="mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton height={16} width={60} className="mb-2" />
                <Skeleton height={44} className="w-full rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Skeleton height={44} width={140} className="rounded-lg" />
          <Skeleton height={44} width={140} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Skeleton for Store Tasks page
export function StoreTasksPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Store Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <Skeleton variant="circular" width={56} height={56} />
          <div>
            <Skeleton height={24} width={200} className="mb-2" />
            <Skeleton height={16} width={150} />
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={36} width={100} className="rounded-full" />
        ))}
      </div>

      {/* Task Cards */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <Skeleton height={20} width={250} className="mb-2" />
                <Skeleton height={14} width={150} />
              </div>
              <Skeleton height={28} width={90} className="rounded-full" />
            </div>
            <div className="flex items-center gap-4 mt-4">
              <Skeleton height={14} width={120} />
              <Skeleton height={14} width={100} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton for Approval page
export function ApprovalPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton height={32} width={220} />
        <Skeleton height={36} width={100} className="rounded-full" />
      </div>

      {/* Pending Tasks Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['Task Name', 'Submitter', 'Submitted', 'Type', 'Actions'].map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <Skeleton height={18} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                <td className="px-4 py-4">
                  <Skeleton height={18} width={200} />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton height={16} width={100} />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Skeleton height={16} width={80} />
                </td>
                <td className="px-4 py-4">
                  <Skeleton height={24} width={70} className="rounded-full" />
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <Skeleton height={32} width={80} className="rounded-lg" />
                    <Skeleton height={32} width={80} className="rounded-lg" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Skeleton for HQ Check page
export function HQCheckPageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton height={32} width={180} />
        <Skeleton height={36} width={120} className="rounded-full" />
      </div>

      {/* Task Cards with Store List */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Task Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" width={40} height={40} />
                  <div>
                    <Skeleton height={20} width={250} className="mb-1" />
                    <Skeleton height={14} width={150} />
                  </div>
                </div>
                <Skeleton height={24} width={40} className="rounded" />
              </div>
            </div>
            {/* Store List */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circular" width={32} height={32} />
                    <Skeleton height={16} width={120} />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton height={32} width={80} className="rounded-lg" />
                    <Skeleton height={32} width={80} className="rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton for Dispatch Library Template page
export function DispatchPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Skeleton height={36} width={36} className="rounded-lg" />
          <Skeleton height={28} width={200} />
        </div>
      </div>

      {/* Template Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div>
            <Skeleton height={20} width={180} className="mb-2" />
            <Skeleton height={14} width={120} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Skeleton height={14} width={80} className="mb-1" />
            <Skeleton height={18} width={120} />
          </div>
          <div>
            <Skeleton height={14} width={80} className="mb-1" />
            <Skeleton height={18} width={100} />
          </div>
        </div>
      </div>

      {/* Dispatch Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <Skeleton height={20} width={150} className="mb-4" />

        {/* Date inputs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <Skeleton height={14} width={80} className="mb-2" />
            <Skeleton height={40} className="rounded-lg" />
          </div>
          <div>
            <Skeleton height={14} width={80} className="mb-2" />
            <Skeleton height={40} className="rounded-lg" />
          </div>
        </div>

        {/* Scope selection */}
        <div className="space-y-4 mb-6">
          <div>
            <Skeleton height={14} width={60} className="mb-2" />
            <Skeleton height={40} className="rounded-lg" />
          </div>
          <div>
            <Skeleton height={14} width={50} className="mb-2" />
            <Skeleton height={40} className="rounded-lg" />
          </div>
          <div>
            <Skeleton height={14} width={50} className="mb-2" />
            <Skeleton height={40} className="rounded-lg" />
          </div>
          <div>
            <Skeleton height={14} width={60} className="mb-2" />
            <Skeleton height={100} className="rounded-lg" />
          </div>
        </div>

        {/* Priority */}
        <div className="mb-6">
          <Skeleton height={14} width={60} className="mb-2" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} height={32} width={70} className="rounded-full" />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Skeleton height={40} width={100} className="rounded-lg" />
          <Skeleton height={40} width={120} className="rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// Skeleton for User Information page
export function UserInfoPageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton height={28} width={200} className="mb-2" />
          <Skeleton height={16} width={300} />
        </div>
        <div className="flex gap-2">
          <Skeleton height={36} width={120} className="rounded-lg" />
          <Skeleton height={36} width={100} className="rounded-lg" />
        </div>
      </div>

      {/* Department Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} height={40} width={100} className="rounded-lg flex-shrink-0" />
        ))}
      </div>

      {/* Hierarchy Tree */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="mb-4">
            {/* Department Header */}
            <div className="flex items-center gap-3 mb-3">
              <Skeleton height={20} width={20} className="rounded" />
              <Skeleton height={20} width={150} />
              <Skeleton height={24} width={30} className="rounded-full" />
            </div>
            {/* Team */}
            <div className="ml-8 space-y-2">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="flex items-center gap-3">
                  <Skeleton height={16} width={16} className="rounded" />
                  <Skeleton height={16} width={120} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Inline content skeleton for within-page loading
export function HierarchySkeleton() {
  return (
    <div className="animate-pulse py-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton height={16} width={16} className="rounded" />
            <Skeleton height={18} width={150} />
          </div>
          <div className="ml-6 space-y-2">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="flex items-center gap-2">
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton height={14} width={100} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton for Store Information page
export function StoreInfoPageSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton height={28} width={220} className="mb-2" />
          <Skeleton height={16} width={280} />
        </div>
        <div className="flex gap-2">
          <Skeleton height={36} width={120} className="rounded-lg" />
          <Skeleton height={36} width={100} className="rounded-lg" />
        </div>
      </div>

      {/* Region Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height={40} width={120} className="rounded-lg flex-shrink-0" />
        ))}
      </div>

      {/* Store Hierarchy Tree */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="mb-6">
            {/* Area Header */}
            <div className="flex items-center gap-3 mb-3">
              <Skeleton height={20} width={20} className="rounded" />
              <Skeleton height={20} width={180} />
              <Skeleton height={24} width={40} className="rounded-full" />
            </div>
            {/* Stores */}
            <div className="ml-8 space-y-3">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j}>
                  <div className="flex items-center gap-3 mb-2">
                    <Skeleton height={16} width={16} className="rounded" />
                    <Skeleton height={16} width={150} />
                  </div>
                  {/* Staff */}
                  <div className="ml-6 space-y-1">
                    {Array.from({ length: 2 }).map((_, k) => (
                      <div key={k} className="flex items-center gap-2">
                        <Skeleton variant="circular" width={24} height={24} />
                        <Skeleton height={14} width={120} />
                        <Skeleton height={14} width={80} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Full page loading overlay
export function FullPageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C5055B] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-sm">{message}</p>
      </div>
    </div>
  );
}

// Inline content loader
export function ContentLoader({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          className={i === rows - 1 ? 'w-2/3' : 'w-full'}
        />
      ))}
    </div>
  );
}

// Button skeleton
export function ButtonSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { height: 32, width: 80 },
    md: { height: 40, width: 100 },
    lg: { height: 48, width: 120 },
  };
  return <Skeleton {...sizes[size]} className="rounded-lg" />;
}

// Avatar skeleton
export function AvatarSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizes = {
    sm: 24,
    md: 32,
    lg: 40,
    xl: 56,
  };
  return <Skeleton variant="circular" width={sizes[size]} height={sizes[size]} />;
}

// Badge skeleton
export function BadgeSkeleton({ width = 80 }: { width?: number }) {
  return <Skeleton height={24} width={width} className="rounded-full" />;
}

// Input skeleton
export function InputSkeleton({ label = true }: { label?: boolean }) {
  return (
    <div>
      {label && <Skeleton height={16} width={80} className="mb-2" />}
      <Skeleton height={44} className="w-full rounded-lg" />
    </div>
  );
}
