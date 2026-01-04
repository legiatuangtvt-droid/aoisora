'use client';

import React from 'react';
import { Region } from '@/types/storeInfo';
import AreaCard from './AreaCard';
import StoreCard from './StoreCard';
import StoreDepartmentCard from './StoreDepartmentCard';
import StaffCard from './StaffCard';
import AddNewButton from './AddNewButton';

interface StoreHierarchyTreeProps {
  region: Region;
  onToggleArea: (areaId: string) => void;
  onToggleStore: (storeId: string) => void;
  onToggleDepartment: (departmentId: string) => void;
  onAddNew: () => void;
  onEditStaff?: (staffId: string) => void;
  onDeleteStaff?: (staffId: string) => void;
}

// StaffCard height: py-3 (12px*2) + content height (~34px) = ~58px
// Midpoint = 29px, plus pt-3 (12px) = 41px from container top
const STAFF_CARD_MIDPOINT = 41;

const StoreHierarchyTree: React.FC<StoreHierarchyTreeProps> = ({
  region,
  onToggleArea,
  onToggleStore,
  onToggleDepartment,
  onAddNew,
  onEditStaff,
  onDeleteStaff,
}) => {
  return (
    <div className="space-y-4">
      {region.areas.map((area) => {
        return (
          <div key={area.id} className="relative">
            {/* Area Card */}
            <AreaCard area={area} onToggle={onToggleArea} />

            {/* Expanded Content */}
            {area.isExpanded && (
              <div className="relative ml-6 pl-6">
                {/* Stores */}
                {area.stores.map((store, storeIndex) => {
                  const isLastStoreItem = storeIndex === area.stores.length - 1 && area.departments.length === 0;
                  const hasStaffList = store.staffList && store.staffList.length > 0;

                  return (
                    <div key={store.id} className="relative pt-4">
                      {/* Vertical line - from top to horizontal connector position */}
                      <div className="absolute -left-6 top-0 h-[50px] w-0.5 bg-[#9B9B9B]" />

                      {/* Vertical line - continues down to next sibling (not for last item without expanded content) */}
                      {(!isLastStoreItem || store.isExpanded) && (
                        <div className="absolute -left-6 top-[50px] bottom-0 w-0.5 bg-[#9B9B9B]" />
                      )}

                      {/* Horizontal connector line - from vertical line to card */}
                      <div className="absolute -left-6 top-[50px] w-6 h-0.5 bg-[#9B9B9B]" />

                      <StoreCard
                        store={store}
                        onToggle={onToggleStore}
                      />

                      {/* Expanded Store Content - Staff List */}
                      {store.isExpanded && hasStaffList && (
                        <div className="relative ml-6 pl-6 mt-2">
                          {store.staffList!.map((staff, staffIndex) => {
                            const isLastStaff = staffIndex === store.staffList!.length - 1;

                            return (
                              <div key={staff.id} className="relative pt-3">
                                {/* Continuous vertical line for all items except last */}
                                {!isLastStaff && (
                                  <div className="absolute -left-6 top-0 bottom-0 w-0.5 bg-[#D1D5DB]" />
                                )}

                                {/* Vertical line segment - only to midpoint for last item */}
                                {isLastStaff && (
                                  <div
                                    className="absolute -left-6 top-0 w-0.5 bg-[#D1D5DB]"
                                    style={{ height: `${STAFF_CARD_MIDPOINT}px` }}
                                  />
                                )}

                                {/* Horizontal connector line - to card midpoint */}
                                <div
                                  className="absolute -left-6 w-6 h-0.5 bg-[#D1D5DB]"
                                  style={{ top: `${STAFF_CARD_MIDPOINT}px` }}
                                />

                                <StaffCard
                                  staff={staff}
                                  onEdit={onEditStaff}
                                  onDelete={onDeleteStaff}
                                />
                              </div>
                            );
                          })}

                          {/* Add Staff Button - no connector lines */}
                          <div className="pt-3">
                            <button
                              onClick={() => console.log('Add staff to store:', store.id)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-[#D1D5DB] rounded-[10px] text-[#6B6B6B] hover:border-[#0664E9] hover:text-[#0664E9] transition-colors"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                              </svg>
                              <span className="text-[13px]">Add Staff</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Empty state when store is expanded but no staff - no connector lines */}
                      {store.isExpanded && !hasStaffList && (
                        <div className="ml-6 pl-6 mt-2">
                          <div className="pt-3">
                            <div className="px-4 py-6 bg-gray-50 border border-dashed border-[#D1D5DB] rounded-[10px] text-center">
                              <p className="text-[14px] text-[#6B6B6B] mb-2">No staff assigned to this store</p>
                              <button
                                onClick={() => console.log('Add first staff to store:', store.id)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-[13px] text-[#0664E9] hover:underline"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <line x1="12" y1="5" x2="12" y2="19" />
                                  <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Add first staff member
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Departments */}
                {area.departments.map((department, deptIndex) => {
                  const isLastItem = deptIndex === area.departments.length - 1;

                  return (
                    <div key={department.id} className="relative pt-4">
                      {/* Vertical line - from top to horizontal connector position */}
                      <div className="absolute -left-6 top-0 h-[50px] w-0.5 bg-[#9B9B9B]" />

                      {/* Vertical line - continues down to next sibling (not for last item) */}
                      {!isLastItem && (
                        <div className="absolute -left-6 top-[50px] bottom-0 w-0.5 bg-[#9B9B9B]" />
                      )}

                      {/* Horizontal connector line - from vertical line to card */}
                      <div className="absolute -left-6 top-[50px] w-6 h-0.5 bg-[#9B9B9B]" />

                      <StoreDepartmentCard
                        department={department}
                        onToggle={onToggleDepartment}
                      />

                      {/* Expanded Department Content */}
                      {department.isExpanded && department.staffList && department.staffList.length > 0 && (
                        <div className="relative ml-6 pl-6 mt-2">
                          {department.staffList.map((staff, staffIndex) => {
                            const isLastStaff = staffIndex === department.staffList!.length - 1;

                            return (
                              <div key={staff.id} className="relative pt-3">
                                {/* Continuous vertical line for all items except last */}
                                {!isLastStaff && (
                                  <div className="absolute -left-6 top-0 bottom-0 w-0.5 bg-[#D1D5DB]" />
                                )}

                                {/* Vertical line segment - only to midpoint for last item */}
                                {isLastStaff && (
                                  <div
                                    className="absolute -left-6 top-0 w-0.5 bg-[#D1D5DB]"
                                    style={{ height: `${STAFF_CARD_MIDPOINT}px` }}
                                  />
                                )}

                                {/* Horizontal connector line - to card midpoint */}
                                <div
                                  className="absolute -left-6 w-6 h-0.5 bg-[#D1D5DB]"
                                  style={{ top: `${STAFF_CARD_MIDPOINT}px` }}
                                />

                                <StaffCard
                                  staff={staff}
                                  onEdit={onEditStaff}
                                  onDelete={onDeleteStaff}
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Add New Button */}
                <div className="pt-4">
                  <AddNewButton onClick={onAddNew} />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StoreHierarchyTree;
