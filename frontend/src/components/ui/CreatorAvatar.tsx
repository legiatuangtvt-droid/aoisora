"use client";

import React, { useState, useRef, useEffect } from "react";

interface CreatorInfo {
  staff_id: number;
  staff_name: string;
  job_grade: string | null;
  department_name?: string;
  department_code?: string;
  avatar_url?: string;
}

interface CreatorAvatarProps {
  creator: CreatorInfo | null | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * CreatorAvatar - Avatar component with hover popup showing creator info
 *
 * Features:
 * - Shows avatar with initial letter (or image if available)
 * - Hover popup displays: avatar with job grade badge, name, department
 * - Job grade badge positioned at bottom-left of avatar
 * - Responsive positioning (popup flips if near edge)
 */
export function CreatorAvatar({
  creator,
  size = "sm",
  className = "",
}: CreatorAvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [popupPosition, setPopupPosition] = useState<"left" | "right">("right");
  const containerRef = useRef<HTMLDivElement>(null);

  // Size mappings for trigger avatar
  const sizeClasses = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-xs",
    lg: "w-10 h-10 text-sm",
  };

  // Calculate popup position to avoid overflow
  useEffect(() => {
    if (isHovered && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      // If popup would overflow right side, show on left
      if (rect.right + 250 > windowWidth) {
        setPopupPosition("left");
      } else {
        setPopupPosition("right");
      }
    }
  }, [isHovered]);

  if (!creator) {
    return null;
  }

  // Get initials from name (first letter of first and last name)
  const getInitials = (name: string): string => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format job grade for display
  const formatJobGrade = (grade: string | null): string => {
    if (!grade) return "";
    // If already in format like "G3" or "S2", return as-is
    if (/^[GS]\d+$/i.test(grade)) {
      return grade.toUpperCase();
    }
    return grade;
  };

  // Get department display text
  const getDepartmentDisplay = (): string => {
    if (creator.department_name && creator.department_code) {
      return `${creator.department_name} (${creator.department_code})`;
    }
    return creator.department_name || creator.department_code || "";
  };

  const jobGrade = formatJobGrade(creator.job_grade);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Trigger Avatar Circle */}
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full bg-gradient-to-br from-gray-400 to-gray-500
          flex items-center justify-center
          text-white font-semibold
          cursor-pointer
          transition-transform duration-200
          hover:scale-110
          shadow-sm
          overflow-hidden
        `}
        title={creator.staff_name}
      >
        {creator.avatar_url ? (
          <img
            src={creator.avatar_url}
            alt={creator.staff_name}
            className="w-full h-full object-cover"
          />
        ) : (
          getInitials(creator.staff_name)
        )}
      </div>

      {/* Hover Popup */}
      {isHovered && (
        <div
          className={`
            absolute z-50
            ${popupPosition === "right" ? "left-full ml-2" : "right-full mr-2"}
            top-1/2 -translate-y-1/2
            bg-white dark:bg-gray-800
            rounded-xl shadow-lg
            border border-gray-200 dark:border-gray-700
            px-4 py-3
            min-w-[220px]
            animate-in fade-in-0 zoom-in-95 duration-150
          `}
        >
          <div className="flex items-center gap-3">
            {/* Avatar with Job Grade Badge */}
            <div className="relative flex-shrink-0">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-semibold text-base overflow-hidden">
                {creator.avatar_url ? (
                  <img
                    src={creator.avatar_url}
                    alt={creator.staff_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <svg className="w-7 h-7 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Job Grade Badge - positioned at bottom-right */}
              {jobGrade && (
                <span
                  className="
                    absolute -bottom-1 -right-1
                    px-1.5 py-0.5
                    bg-teal-100 text-teal-700
                    dark:bg-teal-900/50 dark:text-teal-300
                    text-[10px] font-bold
                    rounded
                    border border-white dark:border-gray-800
                    shadow-sm
                  "
                >
                  {jobGrade}
                </span>
              )}
            </div>

            {/* Name and Department */}
            <div className="flex-1 min-w-0">
              {/* Name */}
              <div className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                {creator.staff_name}
              </div>

              {/* Department */}
              {getDepartmentDisplay() && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">
                  {getDepartmentDisplay()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatorAvatar;
