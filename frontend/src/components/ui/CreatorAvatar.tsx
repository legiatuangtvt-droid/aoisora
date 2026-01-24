"use client";

import React, { useState, useRef, useEffect } from "react";

interface CreatorInfo {
  staff_id: number;
  staff_name: string;
  job_grade: string | null;
  department_name?: string;
  department_code?: string;
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
 * - Shows avatar with initial letter
 * - Hover popup displays: name, job grade badge, department
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
  const popupRef = useRef<HTMLDivElement>(null);

  // Size mappings
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
      if (rect.right + 200 > windowWidth) {
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
  const isHQGrade = jobGrade.startsWith("G");
  const isStoreGrade = jobGrade.startsWith("S");

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Avatar Circle */}
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full bg-gradient-to-br from-blue-500 to-blue-600
          flex items-center justify-center
          text-white font-semibold
          cursor-pointer
          transition-transform duration-200
          hover:scale-110
          shadow-sm
        `}
        title={creator.staff_name}
      >
        {getInitials(creator.staff_name)}
      </div>

      {/* Hover Popup */}
      {isHovered && (
        <div
          ref={popupRef}
          className={`
            absolute z-50
            ${popupPosition === "right" ? "left-full ml-2" : "right-full mr-2"}
            top-1/2 -translate-y-1/2
            bg-white dark:bg-gray-800
            rounded-lg shadow-lg
            border border-gray-200 dark:border-gray-700
            p-3 min-w-[200px]
            animate-in fade-in-0 zoom-in-95 duration-200
          `}
        >
          {/* Arrow pointer */}
          <div
            className={`
              absolute top-1/2 -translate-y-1/2
              ${popupPosition === "right" ? "-left-2" : "-right-2"}
              w-0 h-0
              border-y-[6px] border-y-transparent
              ${
                popupPosition === "right"
                  ? "border-r-[8px] border-r-white dark:border-r-gray-800"
                  : "border-l-[8px] border-l-white dark:border-l-gray-800"
              }
            `}
          />

          <div className="flex items-start gap-3">
            {/* Larger avatar in popup */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {getInitials(creator.staff_name)}
            </div>

            <div className="flex-1 min-w-0">
              {/* Name */}
              <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                {creator.staff_name}
              </div>

              {/* Job Grade Badge */}
              {jobGrade && (
                <span
                  className={`
                    inline-flex items-center px-2 py-0.5 mt-1
                    rounded-full text-xs font-semibold
                    ${
                      isHQGrade
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                        : isStoreGrade
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                    }
                  `}
                >
                  {jobGrade}
                </span>
              )}

              {/* Department */}
              {getDepartmentDisplay() && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
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
