'use client';

import React from 'react';

interface UserInfoHeaderProps {
  onPermissionsClick: () => void;
  onImportClick: () => void;
}

const UserInfoHeader: React.FC<UserInfoHeaderProps> = ({
  onPermissionsClick,
  onImportClick,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-[28px] font-bold text-black leading-8">
          USER INFORMATION
        </h1>
        <p className="text-[13px] text-black mt-1">
          Manage hierarchy, team members, and configure data access permissions.
        </p>
      </div>
      <div className="flex items-center gap-3">
        {/* Permissions Button */}
        <button
          onClick={onPermissionsClick}
          className="inline-flex items-center gap-1.5 px-4 h-10 bg-white border border-[#6B6B6B] rounded-[5px] text-[15px] text-black hover:bg-gray-50 transition-colors"
        >
          <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
              fill="currentColor"
            />
            <circle cx="18" cy="17" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M18 15.5V18.5M16.5 17H19.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          Permissions
        </button>

        {/* Import Excel Button */}
        <button
          onClick={onImportClick}
          className="inline-flex items-center gap-1.5 px-4 h-10 bg-[#0664E9] rounded-[5px] text-[15px] text-white hover:bg-[#0553c7] transition-colors"
        >
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16L12 8M12 8L15 11M12 8L9 11"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 15V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Import Excel
        </button>
      </div>
    </div>
  );
};

export default UserInfoHeader;
