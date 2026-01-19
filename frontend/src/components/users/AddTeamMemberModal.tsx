'use client';

import React, { useState, useEffect } from 'react';
import { JobGrade, JOB_GRADE_TITLES } from '@/types/userInfo';

type ModalMode = 'team' | 'member';

interface Department {
  id: number;
  name: string;
  code: string;
}

interface Team {
  id: string;
  name: string;
  departmentId: number;
}

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeamFormData | MemberFormData) => Promise<void>;
  departments: Department[];
  teams: Team[];
  defaultDepartmentId?: number;
  defaultTeamId?: string;
}

export interface TeamFormData {
  type: 'team';
  teamName: string;
  departmentId: number;
  icon?: string;
  iconColor?: string;
  iconBg?: string;
}

export interface MemberFormData {
  type: 'member';
  staffName: string;
  staffCode: string;
  email: string;
  phone?: string;
  position: string;
  jobGrade: JobGrade;
  departmentId: number;
  teamId?: string;
  sapCode?: string;
  lineManagerId?: number;
}

// HQ Job Grades: G2-G9 (no G1)
const HQ_JOB_GRADES: JobGrade[] = ['G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9'];

const AddTeamMemberModal: React.FC<AddTeamMemberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  departments,
  teams,
  defaultDepartmentId,
  defaultTeamId,
}) => {
  const [mode, setMode] = useState<ModalMode>('member');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Team form state
  const [teamName, setTeamName] = useState('');
  const [teamDepartmentId, setTeamDepartmentId] = useState<number | ''>(defaultDepartmentId || '');

  // Member form state
  const [staffName, setStaffName] = useState('');
  const [staffCode, setStaffCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [jobGrade, setJobGrade] = useState<JobGrade>('G2');
  const [memberDepartmentId, setMemberDepartmentId] = useState<number | ''>(defaultDepartmentId || '');
  const [memberTeamId, setMemberTeamId] = useState<string>(defaultTeamId || '');
  const [sapCode, setSapCode] = useState('');

  // Filter teams based on selected department
  const filteredTeams = teams.filter(
    (team) => team.departmentId === memberDepartmentId
  );

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError(null);
      // Reset team form
      setTeamName('');
      setTeamDepartmentId(defaultDepartmentId || '');
      // Reset member form
      setStaffName('');
      setStaffCode('');
      setEmail('');
      setPhone('');
      setPosition('');
      setJobGrade('G2');
      setMemberDepartmentId(defaultDepartmentId || '');
      setMemberTeamId(defaultTeamId || '');
      setSapCode('');
    }
  }, [isOpen, defaultDepartmentId, defaultTeamId]);

  // Reset team selection when department changes
  useEffect(() => {
    if (memberDepartmentId !== defaultDepartmentId) {
      setMemberTeamId('');
    }
  }, [memberDepartmentId, defaultDepartmentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === 'team') {
        if (!teamName.trim()) {
          throw new Error('Team name is required');
        }
        if (!teamDepartmentId) {
          throw new Error('Please select a department');
        }

        await onSubmit({
          type: 'team',
          teamName: teamName.trim(),
          departmentId: teamDepartmentId,
        });
      } else {
        if (!staffName.trim()) {
          throw new Error('Staff name is required');
        }
        if (!staffCode.trim()) {
          throw new Error('Staff code is required');
        }
        if (!email.trim()) {
          throw new Error('Email is required');
        }
        if (!position.trim()) {
          throw new Error('Position is required');
        }
        if (!memberDepartmentId) {
          throw new Error('Please select a department');
        }

        await onSubmit({
          type: 'member',
          staffName: staffName.trim(),
          staffCode: staffCode.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          position: position.trim(),
          jobGrade,
          departmentId: memberDepartmentId,
          teamId: memberTeamId || undefined,
          sapCode: sapCode.trim() || undefined,
        });
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Add New {mode === 'team' ? 'Team' : 'Member'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setMode('member')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === 'member'
                ? 'text-[#C5055B] border-b-2 border-[#C5055B]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Add Member
          </button>
          <button
            type="button"
            onClick={() => setMode('team')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              mode === 'team'
                ? 'text-[#C5055B] border-b-2 border-[#C5055B]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Add Team
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {mode === 'team' ? (
            /* Team Form */
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Team Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5055B] focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={teamDepartmentId}
                  onChange={(e) => setTeamDepartmentId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5055B] focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            /* Member Form */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Staff Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5055B] focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Staff Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={staffCode}
                    onChange={(e) => setStaffCode(e.target.value)}
                    placeholder="e.g., STF001"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5055B] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5055B] focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5055B] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="e.g., Senior Developer"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5055B] focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Grade <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={jobGrade}
                    onChange={(e) => setJobGrade(e.target.value as JobGrade)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5055B] focus:border-transparent outline-none transition-all"
                  >
                    {HQ_JOB_GRADES.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade} - {JOB_GRADE_TITLES[grade]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={memberDepartmentId}
                    onChange={(e) => setMemberDepartmentId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5055B] focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team
                  </label>
                  <select
                    value={memberTeamId}
                    onChange={(e) => setMemberTeamId(e.target.value)}
                    disabled={!memberDepartmentId}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5055B] focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select team (optional)</option>
                    {filteredTeams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SAP Code
                </label>
                <input
                  type="text"
                  value={sapCode}
                  onChange={(e) => setSapCode(e.target.value)}
                  placeholder="SAP employee code (optional)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C5055B] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-white bg-[#C5055B] rounded-lg hover:bg-[#A50449] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {isSubmitting ? 'Adding...' : `Add ${mode === 'team' ? 'Team' : 'Member'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTeamMemberModal;
