'use client';

import React from 'react';

interface AddNewButtonProps {
  onClick: () => void;
  label?: string;
}

const AddNewButton: React.FC<AddNewButtonProps> = ({
  onClick,
  label = 'Add new Team or Member',
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-[#6B6B6B] rounded-[10px] hover:border-[#C5055B] hover:bg-pink-50 transition-colors group"
    >
      {/* Plus Icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="group-hover:text-[#C5055B]"
      >
        <path
          d="M10 4V16M4 10H16"
          stroke="#6B6B6B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="group-hover:stroke-[#C5055B]"
        />
        <circle
          cx="10"
          cy="10"
          r="9"
          stroke="#6B6B6B"
          strokeWidth="1.5"
          className="group-hover:stroke-[#C5055B]"
        />
      </svg>

      {/* Label */}
      <span className="text-[15px] text-[#6B6B6B] group-hover:text-[#C5055B]">
        {label}
      </span>
    </button>
  );
};

export default AddNewButton;
