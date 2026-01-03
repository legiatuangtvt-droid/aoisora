'use client';

import { useState } from 'react';
import { WorkflowStep } from '@/types/tasks';

interface WorkflowStepsPanelProps {
  steps: WorkflowStep[];
  isOpen: boolean;
  onClose: () => void;
}

// Step status badge config
const STATUS_CONFIG = {
  completed: {
    label: 'Done',
    dotColor: 'bg-[#297EF6]',
    bgColor: 'bg-[#E5F0FF]',
    borderColor: 'border-[#297EF6]',
    textColor: 'text-[#297EF6]',
  },
  in_progress: {
    label: 'In process',
    dotColor: 'bg-[#EDA600]',
    bgColor: 'bg-[#EDA600]/5',
    borderColor: 'border-[#EDA600]',
    textColor: 'text-[#EDA600]',
  },
  pending: {
    label: 'Pending',
    dotColor: 'bg-gray-400',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-400',
    textColor: 'text-gray-500',
  },
};

// Step 1: Submitted status (green)
const SUBMITTED_STATUS = {
  label: 'Submited',
  dotColor: 'bg-[#1BBA5E]',
  bgColor: 'bg-[#EBFFF3]',
  borderColor: 'border-[#1BBA5E]',
  textColor: 'text-[#1BBA5E]',
};

// Step icons
const StepIcon = ({ step, status }: { step: number; status: WorkflowStep['status'] }) => {
  const isActive = status !== 'pending';
  const borderColor = isActive ? 'border-[#C5055B]' : 'border-gray-300';
  const iconColor = isActive ? '#C5055B' : '#9B9B9B';

  if (step === 1) {
    // Submit document icon
    return (
      <div className={`w-[30px] h-[30px] rounded-full border flex items-center justify-center ${borderColor}`}>
        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.9503 8.45018V3.37436C11.9503 3.3191 11.9394 3.26438 11.9183 3.21333C11.8972 3.16228 11.8662 3.1159 11.8271 3.07685L9.62341 0.873203C9.54472 0.794413 9.43796 0.750098 9.3266 0.75H1.17001C1.05862 0.75 0.951785 0.794251 0.873018 0.873018C0.794251 0.951785 0.75 1.05862 0.75 1.17001V14.3303C0.75 14.4417 0.794251 14.5485 0.873018 14.6273C0.951785 14.7061 1.05862 14.7503 1.17001 14.7503H7.75016" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.15039 0.75V3.13006C9.15039 3.24145 9.19464 3.34828 9.27341 3.42705C9.35218 3.50581 9.45901 3.55007 9.5704 3.55007H11.9505M9.15039 12.6503H13.3505M13.3505 12.6503L11.2504 10.5502M13.3505 12.6503L11.2504 14.7503" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  }

  if (step === 2) {
    // Approve icon (badge with checkmark)
    return (
      <div className={`w-[30px] h-[30px] rounded-full border flex items-center justify-center ${borderColor}`}>
        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5 7.845L14.67 5.76L14.925 3L12.2175 2.385L10.8 0L8.25 1.095L5.7 0L4.2825 2.385L1.575 2.9925L1.83 5.7525L0 7.845L1.83 9.93L1.575 12.6975L4.2825 13.3125L5.7 15.6975L8.25 14.595L10.8 15.69L12.2175 13.305L14.925 12.69L14.67 9.93L16.5 7.845ZM6.75 11.595L3.75 8.595L4.8075 7.5375L6.75 9.4725L11.6925 4.53L12.75 5.595L6.75 11.595Z" fill={iconColor}/>
        </svg>
      </div>
    );
  }

  if (step === 3) {
    // Do task icon (arrows with circles)
    return (
      <div className={`w-[30px] h-[30px] rounded-full border flex items-center justify-center ${borderColor}`}>
        <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M8.28 3.79871C8.42045 3.65808 8.49934 3.46746 8.49934 3.26871C8.49934 3.06996 8.42045 2.87933 8.28 2.73871L5.78 0.238708C5.71134 0.165022 5.62854 0.105919 5.53654 0.0649273C5.44454 0.0239353 5.34523 0.00189351 5.24452 0.000116721C5.14382 -0.00166006 5.04379 0.0168646 4.9504 0.0545857C4.85701 0.0923067 4.77218 0.148451 4.70096 0.21967C4.62974 0.290889 4.5736 0.375723 4.53588 0.469111C4.49816 0.562499 4.47963 0.662528 4.48141 0.763231C4.48319 0.863934 4.50523 0.963247 4.54622 1.05525C4.58721 1.14725 4.64631 1.23005 4.72 1.29871L5.94 2.51871H0.75C0.551088 2.51871 0.360322 2.59773 0.21967 2.73838C0.0790177 2.87903 0 3.0698 0 3.26871C0 3.46762 0.0790177 3.65839 0.21967 3.79904C0.360322 3.93969 0.551088 4.01871 0.75 4.01871H5.94L4.72 5.23871C4.64631 5.30737 4.58721 5.39017 4.54622 5.48217C4.50523 5.57417 4.48319 5.67348 4.48141 5.77419C4.47963 5.87489 4.49816 5.97492 4.53588 6.06831C4.5736 6.16169 4.62974 6.24653 4.70096 6.31775C4.77218 6.38897 4.85701 6.44511 4.9504 6.48283C5.04379 6.52055 5.14382 6.53908 5.24452 6.5373C5.34523 6.53552 5.44454 6.51348 5.53654 6.47249C5.62854 6.4315 5.71134 6.3724 5.78 6.29871L8.28 3.79871ZM8.22 7.73871L5.72 10.2387C5.57955 10.3793 5.50066 10.57 5.50066 10.7687C5.50066 10.9675 5.57955 11.1581 5.72 11.2987L8.22 13.7987C8.28866 13.8724 8.37146 13.9315 8.46346 13.9725C8.55546 14.0135 8.65477 14.0355 8.75548 14.0373C8.85618 14.0391 8.95621 14.0206 9.0496 13.9828C9.14299 13.9451 9.22782 13.889 9.29904 13.8177C9.37026 13.7465 9.4264 13.6617 9.46412 13.5683C9.50184 13.4749 9.52037 13.3749 9.51859 13.2742C9.51682 13.1735 9.49477 13.0742 9.45378 12.9822C9.41279 12.8902 9.35369 12.8074 9.28 12.7387L8.06 11.5187H13.25C13.4489 11.5187 13.6397 11.4397 13.7803 11.299C13.921 11.1584 14 10.9676 14 10.7687C14 10.5698 13.921 10.379 13.7803 10.2384C13.6397 10.0977 13.4489 10.0187 13.25 10.0187H8.06L9.28 8.79871C9.35369 8.73005 9.41279 8.64725 9.45378 8.55525C9.49477 8.46325 9.51682 8.36393 9.51859 8.26323C9.52037 8.16253 9.50184 8.0625 9.46412 7.96911C9.4264 7.87572 9.37026 7.79089 9.29904 7.71967C9.22782 7.64845 9.14299 7.59231 9.0496 7.55459C8.95621 7.51686 8.85618 7.49834 8.75548 7.50012C8.65477 7.50189 8.55546 7.52394 8.46346 7.56493C8.37146 7.60592 8.28866 7.66502 8.22 7.73871ZM13 3.26871C13 3.73284 12.8156 4.17796 12.4874 4.50615C12.1592 4.83433 11.7141 5.01871 11.25 5.01871C10.7859 5.01871 10.3408 4.83433 10.0126 4.50615C9.68437 4.17796 9.5 3.73284 9.5 3.26871C9.5 2.80458 9.68437 2.35946 10.0126 2.03127C10.3408 1.70308 10.7859 1.51871 11.25 1.51871C11.7141 1.51871 12.1592 1.70308 12.4874 2.03127C12.8156 2.35946 13 2.80458 13 3.26871ZM2.75 12.5187C3.21413 12.5187 3.65925 12.3343 3.98744 12.0061C4.31563 11.678 4.5 11.2328 4.5 10.7687C4.5 10.3046 4.31563 9.85946 3.98744 9.53127C3.65925 9.20308 3.21413 9.01871 2.75 9.01871C2.28587 9.01871 1.84075 9.20308 1.51256 9.53127C1.18437 9.85946 1 10.3046 1 10.7687C1 11.2328 1.18437 11.678 1.51256 12.0061C1.84075 12.3343 2.28587 12.5187 2.75 12.5187Z" fill={iconColor}/>
        </svg>
      </div>
    );
  }

  if (step === 4) {
    // Check icon (clipboard with checkmark)
    return (
      <div className={`w-[30px] h-[30px] rounded-full border flex items-center justify-center ${borderColor}`}>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.879 0.000631809H2C1.46957 0.000631809 0.960859 0.211345 0.585786 0.586418C0.210714 0.961491 0 1.4702 0 2.00063V8.00063C0 8.53106 0.210714 9.03977 0.585786 9.41484C0.960859 9.78992 1.46957 10.0006 2 10.0006H14C14.5304 10.0006 15.0391 9.78992 15.4142 9.41484C15.7893 9.03977 16 8.53106 16 8.00063V2.12163L11.56 6.56163C11.277 6.83474 10.898 6.98575 10.5047 6.98215C10.1114 6.97855 9.73526 6.82062 9.45727 6.54238C9.17929 6.26413 9.02172 5.88784 9.01849 5.49454C9.01525 5.10124 9.16663 4.72241 9.44 4.43963L13.879 0.000631809ZM2 3.50063C2 3.36802 2.05268 3.24085 2.14645 3.14708C2.24021 3.05331 2.36739 3.00063 2.5 3.00063H4.5C4.63261 3.00063 4.75979 3.05331 4.85355 3.14708C4.94732 3.24085 5 3.36802 5 3.50063C5 3.63324 4.94732 3.76042 4.85355 3.85419C4.75979 3.94795 4.63261 4.00063 4.5 4.00063H2.5C2.36739 4.00063 2.24021 3.94795 2.14645 3.85419C2.05268 3.76042 2 3.63324 2 3.50063ZM2 6.50063C2 6.36802 2.05268 6.24085 2.14645 6.14708C2.24021 6.05331 2.36739 6.00063 2.5 6.00063H7C7.13261 6.00063 7.25979 6.05331 7.35355 6.14708C7.44732 6.24085 7.5 6.36802 7.5 6.50063C7.5 6.63324 7.44732 6.76042 7.35355 6.85419C7.25979 6.94795 7.13261 7.00063 7 7.00063H2.5C2.36739 7.00063 2.24021 6.94795 2.14645 6.85419C2.05268 6.76042 2 6.63324 2 6.50063ZM15.854 0.854632C15.9479 0.760745 16.0006 0.633408 16.0006 0.500632C16.0006 0.367856 15.9479 0.240518 15.854 0.146632C15.7601 0.0527451 15.6328 2.61733e-09 15.5 0C15.3672 -2.61733e-09 15.2399 0.0527451 15.146 0.146632L10.146 5.14663C10.0521 5.24052 9.99937 5.36786 9.99937 5.50063C9.99937 5.63341 10.0521 5.76075 10.146 5.85463C10.2399 5.94852 10.3672 6.00126 10.5 6.00126C10.6328 6.00126 10.7601 5.94852 10.854 5.85463L15.854 0.854632Z" fill={iconColor}/>
        </svg>
      </div>
    );
  }

  return null;
};

export default function WorkflowStepsPanel({ steps, isOpen, onClose }: WorkflowStepsPanelProps) {
  const [activeRound, setActiveRound] = useState(1);

  if (!isOpen) return null;

  const getStatusConfig = (step: WorkflowStep) => {
    // Step 1 uses green "Submitted" status when completed
    if (step.step === 1 && step.status === 'completed') {
      return SUBMITTED_STATUS;
    }
    return STATUS_CONFIG[step.status];
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[414px] bg-white z-50 shadow-xl overflow-y-auto">
        <div className="p-6">
          {/* Round Tabs */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-[#ECECEC] rounded-[10px] p-1 gap-3">
              <button
                onClick={() => setActiveRound(1)}
                className={`px-4 py-2 rounded-[10px] text-base transition-colors ${
                  activeRound === 1
                    ? 'bg-white text-[#C5055B]'
                    : 'text-[#6B6B6B] hover:text-gray-800'
                }`}
              >
                Round 1
              </button>
              <button
                onClick={() => setActiveRound(2)}
                className={`px-4 py-2 rounded-[10px] text-base transition-colors ${
                  activeRound === 2
                    ? 'bg-white text-[#C5055B]'
                    : 'text-[#6B6B6B] hover:text-gray-800'
                }`}
              >
                Round 2
              </button>
            </div>
          </div>

          {/* Steps Timeline */}
          <div className="relative">
            {/* Steps */}
            <div className="space-y-5">
              {steps.map((step, index) => {
                const statusConfig = getStatusConfig(step);
                const isLastStep = index === steps.length - 1;
                const hasComment = step.comment && step.comment.length > 0;

                return (
                  <div key={step.id} className="flex gap-4">
                    {/* Step Icon with connecting line */}
                    <div className="relative flex-shrink-0 flex flex-col items-center">
                      {/* Icon */}
                      <div className="relative z-10 bg-white">
                        <StepIcon step={step.step} status={step.status} />
                      </div>
                      {/* Connecting line to next step (not for last step) */}
                      {!isLastStep && (
                        <div className="w-[2px] flex-1 min-h-[20px] bg-[#C5055B] mt-1" />
                      )}
                    </div>

                    {/* Step Card */}
                    <div className="flex-1 bg-[#F9F9F9] border border-[#9B9B9B] rounded-[10px] p-4">
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          {/* Step Title */}
                          <h3 className="text-xl font-bold text-black">
                            Step {step.step}: {step.name}
                          </h3>

                          {/* Status Badge */}
                          <div className={`inline-flex items-center gap-2 px-2 py-0.5 rounded-full border ${statusConfig.borderColor} ${statusConfig.bgColor} mt-1`}>
                            {step.status !== 'pending' && step.step !== 3 && (
                              <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`} />
                            )}
                            <span className={`text-[13px] ${statusConfig.textColor}`}>
                              {step.step === 3 && step.skipInfo ? step.skipInfo : statusConfig.label}
                            </span>
                          </div>
                        </div>

                        {/* Avatar (only for steps with assignee) */}
                        {step.assignee?.avatar && (
                          <div className="w-[30px] h-[30px] rounded-full bg-gray-300 overflow-hidden">
                            <img
                              src={step.assignee.avatar}
                              alt={step.assignee.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Assign to */}
                      {(step.assignee || step.skipInfo) && (
                        <div className="mb-3">
                          <span className="text-[13px] text-[#6B6B6B]">Assign to</span>
                          <p className="text-base text-black">
                            {step.skipInfo || step.assignee?.name}
                          </p>
                        </div>
                      )}

                      {/* Dates Row */}
                      <div className="flex gap-8">
                        <div>
                          <span className="text-[13px] text-[#6B6B6B]">Start Day</span>
                          <p className="text-base text-black">{step.startDay || '-'}</p>
                        </div>
                        <div>
                          <span className="text-[13px] text-[#6B6B6B]">End Day</span>
                          <p className="text-base text-black">{step.endDay || '-'}</p>
                        </div>
                      </div>

                      {/* Comment Section (only for certain steps) */}
                      {hasComment && (
                        <>
                          <div className="border-t border-[#6B6B6B] my-4" />
                          <div className="bg-[#E9E9E9] rounded-[10px] p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <svg width="14" height="13" viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 3C1 1.89543 1.89543 1 3 1H11C12.1046 1 13 1.89543 13 3V8C13 9.10457 12.1046 10 11 10H4L1 13V3Z" stroke="#6B6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span className="text-[13px] text-[#6B6B6B]">Comment</span>
                            </div>
                            <p className="text-[15px] text-[#6B6B6B]">
                              &ldquo;{step.comment}&rdquo;
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
