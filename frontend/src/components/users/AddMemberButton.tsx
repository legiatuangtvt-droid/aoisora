'use client';

import React from 'react';

interface AddMemberButtonProps {
  onClick: () => void;
}

const AddMemberButton: React.FC<AddMemberButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full h-[61px] border border-dashed border-[#6B6B6B] rounded-[10px] flex items-center justify-center gap-2 text-[#6B6B6B] hover:bg-gray-50 hover:border-gray-500 transition-colors"
    >
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
      </svg>
      <span className="text-[15px]">Add new Team or Member</span>
    </button>
  );
};

export default AddMemberButton;
