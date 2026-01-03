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
    // Approve icon (checkmark)
    return (
      <div className={`w-[30px] h-[30px] rounded-full border flex items-center justify-center ${borderColor}`}>
        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.5 4.5L6.5 12.5L2.5 8.5" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    );
  }

  if (step === 3) {
    // Do task icon (settings/gear)
    return (
      <div className={`w-[30px] h-[30px] rounded-full border flex items-center justify-center ${borderColor}`}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 1H8.5L9 3L11 4L13 3.5V6.5L11 7L10 9L11 11H8L7 9.5L5 9L3.5 11H1L2 8.5L1 6.5L3 5.5L4 3L3.5 1H5.5Z" stroke={iconColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="7" cy="7" r="2" stroke={iconColor} strokeWidth="1.5"/>
        </svg>
      </div>
    );
  }

  if (step === 4) {
    // Check icon (clipboard check)
    return (
      <div className={`w-[30px] h-[30px] rounded-full border flex items-center justify-center ${borderColor}`}>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5L5 9L15 1" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
