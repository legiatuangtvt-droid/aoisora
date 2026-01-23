'use client';

import { useState, useMemo } from 'react';

// =============================================================================
// TypeScript Interfaces
// =============================================================================

export type StepStatus = 'submitted' | 'done' | 'in_process' | 'rejected' | 'pending';

export type StepName = 'SUBMIT' | 'APPROVE' | 'DO_TASK' | 'CHECK';

export interface StepAssignee {
  type: 'user' | 'stores' | 'team';
  id?: number;
  name: string;
  avatar?: string;
  count?: number; // For stores type
}

export interface StepProgress {
  done: number;
  total: number;
}

export interface HistoryStep {
  stepNumber: number;
  stepName: StepName;
  status: StepStatus;
  assignee: StepAssignee;
  startDate: string;
  endDate: string;
  actualStartAt?: string;
  actualEndAt?: string;
  comment?: string;
  progress?: StepProgress; // For DO_TASK step
}

export interface HistoryRound {
  roundNumber: number;
  steps: HistoryStep[];
}

export interface TaskApprovalHistory {
  taskId: string;
  taskName: string;
  taskStartDate?: string; // Task applicable period start
  taskEndDate?: string;   // Task applicable period end
  currentRound: number;
  totalRounds: number;
  rounds: HistoryRound[];
}

interface ApprovalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: TaskApprovalHistory | null;
  onViewTask?: (taskId: string) => void;
}

// =============================================================================
// Status Badge Component
// =============================================================================

interface StatusBadgeProps {
  status: StepStatus;
  progress?: StepProgress;
}

function StatusBadge({ status, progress }: StatusBadgeProps) {
  // If there's progress data, show progress badge
  if (progress) {
    return (
      <span
        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
        style={{ backgroundColor: '#1BBA5E', color: 'white' }}
      >
        {progress.done}/{progress.total}
      </span>
    );
  }

  const statusConfig: Record<StepStatus, { label: string; bgColor: string; textColor: string }> = {
    submitted: { label: 'Submitted', bgColor: '#1BBA5E', textColor: 'white' },
    done: { label: 'Done', bgColor: '#297EF6', textColor: 'white' },
    in_process: { label: 'In process', bgColor: '#EDA600', textColor: 'white' },
    rejected: { label: 'Rejected', bgColor: '#EF4444', textColor: 'white' },
    pending: { label: 'Pending', bgColor: '#9B9B9B', textColor: 'white' },
  };

  const config = statusConfig[status];

  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: config.bgColor, color: config.textColor }}
    >
      {config.label}
    </span>
  );
}

// =============================================================================
// Step Icon Component
// =============================================================================

interface StepIconProps {
  stepName: StepName;
  status: StepStatus;
  isLast: boolean;
}

function StepIcon({ stepName, status, isLast }: StepIconProps) {
  const isCompleted = status === 'done' || status === 'submitted';
  const isActive = isCompleted || status === 'in_process';
  const fillColor = isActive ? '#C5055B' : '#9B9B9B';

  // Icons from Figma - using fill instead of stroke
  const icons: Record<StepName, JSX.Element> = {
    SUBMIT: (
      // Step 1 icon from Figma
      <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.28 3.79871C8.42045 3.65808 8.49934 3.46746 8.49934 3.26871C8.49934 3.06996 8.42045 2.87933 8.28 2.73871L5.78 0.238708C5.71134 0.165022 5.62854 0.105919 5.53654 0.0649273C5.44454 0.0239353 5.34523 0.00189351 5.24452 0.000116721C5.14382 -0.00166006 5.04379 0.0168646 4.9504 0.0545857C4.85701 0.0923067 4.77218 0.148451 4.70096 0.21967C4.62974 0.290889 4.5736 0.375723 4.53588 0.469111C4.49816 0.562499 4.47963 0.662528 4.48141 0.763231C4.48319 0.863934 4.50523 0.963247 4.54622 1.05525C4.58721 1.14725 4.64631 1.23005 4.72 1.29871L5.94 2.51871H0.75C0.551088 2.51871 0.360322 2.59773 0.21967 2.73838C0.0790177 2.87903 0 3.0698 0 3.26871C0 3.46762 0.0790177 3.65839 0.21967 3.79904C0.360322 3.93969 0.551088 4.01871 0.75 4.01871H5.94L4.72 5.23871C4.64631 5.30737 4.58721 5.39017 4.54622 5.48217C4.50523 5.57417 4.48319 5.67348 4.48141 5.77419C4.47963 5.87489 4.49816 5.97492 4.53588 6.06831C4.5736 6.16169 4.62974 6.24653 4.70096 6.31775C4.77218 6.38897 4.85701 6.44511 4.9504 6.48283C5.04379 6.52055 5.14382 6.53908 5.24452 6.5373C5.34523 6.53552 5.44454 6.51348 5.53654 6.47249C5.62854 6.4315 5.71134 6.3724 5.78 6.29871L8.28 3.79871ZM8.22 7.73871L5.72 10.2387C5.57955 10.3793 5.50066 10.57 5.50066 10.7687C5.50066 10.9675 5.57955 11.1581 5.72 11.2987L8.22 13.7987C8.28866 13.8724 8.37146 13.9315 8.46346 13.9725C8.55546 14.0135 8.65477 14.0355 8.75548 14.0373C8.85618 14.0391 8.95621 14.0206 9.0496 13.9828C9.14299 13.9451 9.22782 13.889 9.29904 13.8177C9.37026 13.7465 9.4264 13.6617 9.46412 13.5683C9.50184 13.4749 9.52037 13.3749 9.51859 13.2742C9.51682 13.1735 9.49477 13.0742 9.45378 12.9822C9.41279 12.8902 9.35369 12.8074 9.28 12.7387L8.06 11.5187H13.25C13.4489 11.5187 13.6397 11.4397 13.7803 11.299C13.921 11.1584 14 10.9676 14 10.7687C14 10.5698 13.921 10.379 13.7803 10.2384C13.6397 10.0977 13.4489 10.0187 13.25 10.0187H8.06L9.28 8.79871C9.35369 8.73005 9.41279 8.64725 9.45378 8.55525C9.49477 8.46325 9.51682 8.36393 9.51859 8.26323C9.52037 8.16253 9.50184 8.0625 9.46412 7.96911C9.4264 7.87572 9.37026 7.79089 9.29904 7.71967C9.22782 7.64845 9.14299 7.59231 9.0496 7.55459C8.95621 7.51686 8.85618 7.49834 8.75548 7.50012C8.65477 7.50189 8.55546 7.52394 8.46346 7.56493C8.37146 7.60592 8.28866 7.66502 8.22 7.73871ZM13 3.26871C13 3.73284 12.8156 4.17796 12.4874 4.50615C12.1592 4.83433 11.7141 5.01871 11.25 5.01871C10.7859 5.01871 10.3408 4.83433 10.0126 4.50615C9.68437 4.17796 9.5 3.73284 9.5 3.26871C9.5 2.80458 9.68437 2.35946 10.0126 2.03127C10.3408 1.70308 10.7859 1.51871 11.25 1.51871C11.7141 1.51871 12.1592 1.70308 12.4874 2.03127C12.8156 2.35946 13 2.80458 13 3.26871ZM2.75 12.5187C3.21413 12.5187 3.65925 12.3343 3.98744 12.0061C4.31563 11.678 4.5 11.2328 4.5 10.7687C4.5 10.3046 4.31563 9.85946 3.98744 9.53127C3.65925 9.20308 3.21413 9.01871 2.75 9.01871C2.28587 9.01871 1.84075 9.20308 1.51256 9.53127C1.18437 9.85946 1 10.3046 1 10.7687C1 11.2328 1.18437 11.678 1.51256 12.0061C1.84075 12.3343 2.28587 12.5187 2.75 12.5187Z" fill={fillColor}/>
      </svg>
    ),
    APPROVE: (
      // Step 2 icon from Figma - checkmark badge
      <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.5 7.845L14.67 5.76L14.925 3L12.2175 2.385L10.8 0L8.25 1.095L5.7 0L4.2825 2.385L1.575 2.9925L1.83 5.7525L0 7.845L1.83 9.93L1.575 12.6975L4.2825 13.3125L5.7 15.6975L8.25 14.595L10.8 15.69L12.2175 13.305L14.925 12.69L14.67 9.93L16.5 7.845ZM6.75 11.595L3.75 8.595L4.8075 7.5375L6.75 9.4725L11.6925 4.53L12.75 5.595L6.75 11.595Z" fill={fillColor}/>
      </svg>
    ),
    DO_TASK: (
      // Step 3 icon from Figma - document with arrow
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.879 0.000631809H2C1.46957 0.000631809 0.960859 0.211345 0.585786 0.586418C0.210714 0.961491 0 1.4702 0 2.00063V8.00063C0 8.53106 0.210714 9.03977 0.585786 9.41484C0.960859 9.78992 1.46957 10.0006 2 10.0006H14C14.5304 10.0006 15.0391 9.78992 15.4142 9.41484C15.7893 9.03977 16 8.53106 16 8.00063V2.12163L11.56 6.56163C11.277 6.83474 10.898 6.98575 10.5047 6.98215C10.1114 6.97855 9.73526 6.82062 9.45727 6.54238C9.17929 6.26413 9.02172 5.88784 9.01849 5.49454C9.01525 5.10124 9.16663 4.72241 9.44 4.43963L13.879 0.000631809ZM2 3.50063C2 3.36802 2.05268 3.24085 2.14645 3.14708C2.24021 3.05331 2.36739 3.00063 2.5 3.00063H4.5C4.63261 3.00063 4.75979 3.05331 4.85355 3.14708C4.94732 3.24085 5 3.36802 5 3.50063C5 3.63324 4.94732 3.76042 4.85355 3.85419C4.75979 3.94795 4.63261 4.00063 4.5 4.00063H2.5C2.36739 4.00063 2.24021 3.94795 2.14645 3.85419C2.05268 3.76042 2 3.63324 2 3.50063ZM2 6.50063C2 6.36802 2.05268 6.24085 2.14645 6.14708C2.24021 6.05331 2.36739 6.00063 2.5 6.00063H7C7.13261 6.00063 7.25979 6.05331 7.35355 6.14708C7.44732 6.24085 7.5 6.36802 7.5 6.50063C7.5 6.63324 7.44732 6.76042 7.35355 6.85419C7.25979 6.94795 7.13261 7.00063 7 7.00063H2.5C2.36739 7.00063 2.24021 6.94795 2.14645 6.85419C2.05268 6.76042 2 6.63324 2 6.50063ZM15.854 0.854632C15.9479 0.760745 16.0006 0.633408 16.0006 0.500632C16.0006 0.367856 15.9479 0.240518 15.854 0.146632C15.7601 0.0527451 15.6328 2.61733e-09 15.5 0C15.3672 -2.61733e-09 15.2399 0.0527451 15.146 0.146632L10.146 5.14663C10.0521 5.24052 9.99937 5.36786 9.99937 5.50063C9.99937 5.63341 10.0521 5.76075 10.146 5.85463C10.2399 5.94852 10.3672 6.00126 10.5 6.00126C10.6328 6.00126 10.7601 5.94852 10.854 5.85463L15.854 0.854632Z" fill={fillColor}/>
      </svg>
    ),
    CHECK: (
      // Step 4 icon from Figma - document with arrow (stroke-based)
      <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.9503 8.45018V3.37436C11.9503 3.3191 11.9394 3.26438 11.9183 3.21333C11.8972 3.16228 11.8662 3.1159 11.8271 3.07685L9.62341 0.873203C9.54472 0.794413 9.43796 0.750098 9.3266 0.75H1.17001C1.05862 0.75 0.951785 0.794251 0.873018 0.873018C0.794251 0.951785 0.75 1.05862 0.75 1.17001V14.3303C0.75 14.4417 0.794251 14.5485 0.873018 14.6273C0.951785 14.7061 1.05862 14.7503 1.17001 14.7503H7.75016" stroke={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9.15019 0.75V3.13006C9.15019 3.24145 9.19444 3.34828 9.27321 3.42705C9.35198 3.50581 9.45881 3.55007 9.5702 3.55007H11.9503M9.15019 12.6503H13.3503M13.3503 12.6503L11.2502 10.5502M13.3503 12.6503L11.2502 14.7503" stroke={fillColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  return (
    <div className="relative flex flex-col items-center flex-shrink-0" style={{ width: '36px' }}>
      {/* Icon Circle */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center z-10 relative flex-shrink-0"
        style={{
          backgroundColor: isActive ? '#FDF2F8' : '#F3F4F6',
          border: `2px solid ${fillColor}`
        }}
      >
        {icons[stepName]}
      </div>

      {/* Connecting Line - extends from bottom of icon to bottom of card + gap */}
      {!isLast && (
        <div
          className="flex-1 w-0.5"
          style={{
            backgroundColor: isCompleted ? '#C5055B' : '#E5E7EB',
            minHeight: '16px', // Ensures line is visible even if card is small
            marginBottom: '-16px', // Extends into the gap below to connect to next icon
          }}
        />
      )}
    </div>
  );
}

// =============================================================================
// Step Card Component
// =============================================================================

interface StepCardProps {
  step: HistoryStep;
}

function StepCard({ step }: StepCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const stepTitles: Record<StepName, string> = {
    SUBMIT: 'Step 1: SUBMIT',
    APPROVE: 'Step 2: APPROVE',
    DO_TASK: 'Step 3: DO TASK',
    CHECK: 'Step 4: CHECK',
  };

  return (
    <div
      className="rounded-lg p-4 flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-400 dark:border-gray-600 transition-all duration-200 hover:shadow-md"
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            {stepTitles[step.stepName]}
          </h4>
          <StatusBadge status={step.status} progress={step.progress} />
        </div>

        {/* Avatar */}
        {step.assignee.type === 'user' && step.assignee.avatar && (
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img
              src={step.assignee.avatar}
              alt={step.assignee.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {step.assignee.type === 'user' && !step.assignee.avatar && (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium"
            style={{ backgroundColor: '#C5055B' }}
          >
            {step.assignee.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Assignee */}
      <div className="mb-3">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Assign to</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {step.assignee.type === 'stores'
            ? `${step.assignee.count || step.assignee.name} Stores`
            : step.assignee.name
          }
        </p>
      </div>

      {/* Date Range */}
      <div className="flex gap-6 mb-3">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Start Day</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(step.startDate)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">End Day</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(step.endDate)}</p>
        </div>
      </div>

      {/* Comment Section */}
      {step.comment && (
        <div className="rounded-lg p-3 mt-2 bg-gray-200 dark:bg-gray-600">
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <div>
              <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Comment</p>
              <p className="text-sm text-gray-700 dark:text-gray-200">{step.comment}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Main Modal Component
// =============================================================================

export default function ApprovalHistoryModal({
  isOpen,
  onClose,
  history,
  onViewTask,
}: ApprovalHistoryModalProps) {
  const [selectedRound, setSelectedRound] = useState(1);

  // Format date-time for header display (e.g., "04:30 30 Nov 2025")
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${hours}:${minutes} ${day} ${month} ${year}`;
  };

  // Get steps for selected round
  const currentRoundSteps = useMemo(() => {
    if (!history) return [];
    const round = history.rounds.find(r => r.roundNumber === selectedRound);
    return round?.steps || [];
  }, [history, selectedRound]);

  // Reset selected round when history changes
  useMemo(() => {
    if (history) {
      setSelectedRound(history.currentRound);
    }
  }, [history]);

  if (!isOpen || !history) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-scale-in"
          style={{ width: '414px' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header - Task Info */}
          <div className="px-6 py-4 flex-shrink-0">
            {/* Close button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Task Name */}
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{history.taskName}</h2>

            {/* Task Dates */}
            {(history.taskStartDate || history.taskEndDate) && (
              <div className="flex gap-8">
                {history.taskStartDate && (
                  <div>
                    <span
                      className="text-xs font-medium mb-1"
                      style={{ color: '#536887' }}
                    >
                      Start
                    </span>
                    <p className="text-sm text-gray-900 dark:text-white">{formatDateTime(history.taskStartDate)}</p>
                  </div>
                )}
                {history.taskEndDate && (
                  <div>
                    <span
                      className="text-xs font-medium mb-1 text-teal-700 dark:text-teal-400"
                    >
                      End
                    </span>
                    <p className="text-sm text-gray-900 dark:text-white">{formatDateTime(history.taskEndDate)}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Round Tabs (if multiple rounds) */}
          {history.totalRounds > 1 && (
            <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700 flex gap-2 flex-shrink-0">
              {history.rounds.map((round) => (
                <button
                  key={round.roundNumber}
                  onClick={() => setSelectedRound(round.roundNumber)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                    selectedRound === round.roundNumber
                      ? 'bg-[#C5055B] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Round {round.roundNumber}
                </button>
              ))}
            </div>
          )}

          {/* Link to Task */}
          {onViewTask && (
            <div className="px-6 pt-4 flex justify-end flex-shrink-0">
              <button
                onClick={() => onViewTask(history.taskId)}
                className="text-sm text-[#C5055B] hover:underline italic"
              >
                Link ASSIGN TASK
              </button>
            </div>
          )}

          {/* Content - Timeline */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="flex flex-col gap-4">
              {currentRoundSteps.map((step, index) => (
                <div
                  key={step.stepNumber}
                  className="flex gap-4 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                >
                  {/* Icon with connecting line */}
                  <StepIcon
                    stepName={step.stepName}
                    status={step.status}
                    isLast={index === currentRoundSteps.length - 1}
                  />
                  {/* Step Card */}
                  <StepCard step={step} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
