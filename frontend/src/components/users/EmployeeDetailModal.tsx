'use client';

import React from 'react';
import { Employee, JOB_GRADE_COLORS, JOB_GRADE_TITLES } from '@/types/userInfo';

interface EmployeeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  if (!isOpen || !employee) return null;

  const gradeColor = JOB_GRADE_COLORS[employee.jobGrade];
  const gradeTitle = JOB_GRADE_TITLES[employee.jobGrade];

  // Format joining date
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-[10px] shadow-xl w-[450px] max-h-[90vh] overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-[#6B6B6B] hover:text-gray-800 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          {/* Header - Avatar and basic info */}
          <div className="flex items-start gap-4 mb-6">
            {/* Avatar with grade badge */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                {employee.avatar ? (
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-gray-500 text-xl font-medium">
                    {employee.name.charAt(0)}
                  </span>
                )}
              </div>
              {/* Grade badge */}
              <div
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-white text-[13px] border-2 border-white"
                style={{ backgroundColor: gradeColor }}
              >
                {employee.jobGrade}
              </div>
            </div>

            {/* Name, position, status */}
            <div className="flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base font-bold text-black">
                  {employee.name}
                </h2>
                {/* Active status badge */}
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  employee.status === 'Active'
                    ? 'bg-green-100 text-green-600 border border-green-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}>
                  {employee.status || 'Active'}
                </span>
              </div>
              <p className="text-[13px] text-[#6B6B6B] mb-2">
                {employee.position}
              </p>

              {/* Contact info */}
              <div className="flex items-center gap-4 text-[11px] text-[#6B6B6B]">
                {employee.email && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{employee.email}</span>
                  </div>
                )}
                {employee.phone && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{employee.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
            {/* SAP Code */}
            <div>
              <p className="text-[11px] font-bold text-[#6B6B6B] uppercase mb-1">SAP CODE</p>
              <p className="text-base font-bold text-black">{employee.sapCode || '-'}</p>
            </div>

            {/* Line Manager */}
            <div>
              <p className="text-[11px] font-bold text-[#6B6B6B] uppercase mb-1">LINE MANAGER</p>
              {employee.lineManager ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {employee.lineManager.avatar ? (
                      <img
                        src={employee.lineManager.avatar}
                        alt={employee.lineManager.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-xs">
                        {employee.lineManager.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#C5055B]">{employee.lineManager.name}</p>
                    <p className="text-[11px] text-[#6B6B6B]">{employee.lineManager.sapCode}</p>
                  </div>
                </div>
              ) : (
                <p className="text-base text-black">-</p>
              )}
            </div>

            {/* Job Grade */}
            <div>
              <p className="text-[11px] font-bold text-[#6B6B6B] uppercase mb-1">JOB GRADE</p>
              <p className="text-base font-medium" style={{ color: gradeColor }}>
                {employee.jobGrade} - {gradeTitle}
              </p>
            </div>

            {/* Joining Date */}
            <div>
              <p className="text-[11px] font-bold text-[#6B6B6B] uppercase mb-1">JOINING DATE</p>
              <p className="text-base text-black">{formatDate(employee.joiningDate)}</p>
            </div>
          </div>

          {/* Organization Detail section */}
          {employee.organization && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-[#C5055B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <h3 className="text-base font-bold text-black">Organization Detail</h3>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {/* Division */}
                <div>
                  <p className="text-[11px] font-bold text-[#6B6B6B] uppercase mb-1">DIVISION</p>
                  <p className="text-base text-black">{employee.organization.division || '-'}</p>
                </div>

                {/* Department */}
                <div>
                  <p className="text-[11px] font-bold text-[#6B6B6B] uppercase mb-1">DEPARTMENT</p>
                  <p className="text-base text-black">{employee.organization.department || '-'}</p>
                </div>

                {/* Sector */}
                <div>
                  <p className="text-[11px] font-bold text-[#6B6B6B] uppercase mb-1">SECTOR</p>
                  <p className="text-base text-black">{employee.organization.section || '-'}</p>
                </div>

                {/* Location */}
                <div>
                  <p className="text-[11px] font-bold text-[#6B6B6B] uppercase mb-1">DEPARTMENT</p>
                  <p className="text-base text-black">{employee.organization.location || '-'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailModal;
