'use client';

import React from 'react';

interface StoreInfoHeaderProps {
  onPermissionsClick: () => void;
  onImportClick: () => void;
}

const StoreInfoHeader: React.FC<StoreInfoHeaderProps> = ({
  onPermissionsClick,
  onImportClick,
}) => {
  return (
    <div className="flex items-start justify-between mb-4">
      {/* Title Section */}
      <div>
        <h1 className="text-[28px] font-bold text-black leading-8">
          STORE INFORMATION
        </h1>
        <p className="text-[13px] text-black mt-1">
          Manage hierarchy, team members, and configure data access permissions.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        {/* Permissions Button */}
        <button
          onClick={onPermissionsClick}
          className="flex items-center gap-1.5 px-4 h-10 bg-white border border-[#6B6B6B] rounded-[5px] hover:bg-gray-50 transition-colors"
        >
          {/* User Settings Icon */}
          <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 1.0625C9.34277 1.0625 10.151 1.39716 10.7457 1.99188C11.3403 2.58661 11.675 3.39484 11.675 4.2375C11.675 5.08016 11.3403 5.88839 10.7457 6.48312C10.151 7.07784 9.34277 7.4125 8.5 7.4125C7.65723 7.4125 6.849 7.07784 6.25427 6.48312C5.65955 5.88839 5.325 5.08016 5.325 4.2375C5.325 3.39484 5.65955 2.58661 6.25427 1.99188C6.849 1.39716 7.65723 1.0625 8.5 1.0625ZM8.5 8.9375C11.022 8.9375 13.0625 9.95775 13.0625 11.2188V12.75H3.9375V11.2188C3.9375 9.95775 5.978 8.9375 8.5 8.9375Z" fill="black"/>
            <path d="M14.875 11.6875C14.875 12.549 14.5329 13.3751 13.9228 13.9853C13.3126 14.5954 12.4865 14.9375 11.625 14.9375C10.7635 14.9375 9.93745 14.5954 9.32718 13.9853C8.71707 13.3751 8.375 12.549 8.375 11.6875C8.375 10.826 8.71707 9.99995 9.32718 9.38968C9.93745 8.77957 10.7635 8.4375 11.625 8.4375C12.4865 8.4375 13.3126 8.77957 13.9228 9.38968C14.5329 9.99995 14.875 10.826 14.875 11.6875Z" fill="white"/>
            <path d="M12.3125 10.625L12.6021 10.5021C12.7187 10.4521 12.7812 10.3271 12.7604 10.2021L12.7146 9.89375C12.7021 9.81458 12.7562 9.73958 12.8354 9.72708L13.1479 9.67708C13.2729 9.65625 13.3604 9.54375 13.3479 9.41875L13.3187 9.10625C13.3104 9.02708 13.3687 8.95625 13.4479 8.94375L13.7604 8.89375C13.8854 8.87292 13.9729 8.76042 13.9604 8.63542L13.9312 8.32708C13.9229 8.24792 13.9812 8.17708 14.0604 8.16458L14.3729 8.11458C14.4979 8.09375 14.5854 7.98125 14.5729 7.85625L14.5437 7.54792C14.5354 7.46875 14.5937 7.39792 14.6729 7.38542L15.0312 7.32708" stroke="black" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="11.625" cy="11.6875" r="2.125" stroke="black" strokeWidth="0.75"/>
          </svg>
          <span className="text-[15px] text-black">Permissions</span>
        </button>

        {/* Import Excel Button */}
        <button
          onClick={onImportClick}
          className="flex items-center gap-1.5 px-4 h-10 bg-[#0664E9] rounded-[5px] hover:bg-blue-700 transition-colors"
        >
          {/* Import Icon */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 1.5V10.5M9 10.5L6 7.5M9 10.5L12 7.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.5 12V14.25C1.5 14.6478 1.65804 15.0294 1.93934 15.3107C2.22064 15.592 2.60218 15.75 3 15.75H15C15.3978 15.75 15.7794 15.592 16.0607 15.3107C16.342 15.0294 16.5 14.6478 16.5 14.25V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[15px] text-white">Import Excel</span>
        </button>
      </div>
    </div>
  );
};

export default StoreInfoHeader;
