'use client';

import React from 'react';
import { Region, Area, Store, StoreDepartment } from '@/types/storeInfo';
import AreaCard from './AreaCard';
import StoreCard from './StoreCard';
import StoreDepartmentCard from './StoreDepartmentCard';
import AddNewButton from './AddNewButton';

interface StoreHierarchyTreeProps {
  region: Region;
  onToggleArea: (areaId: string) => void;
  onToggleStore: (storeId: string) => void;
  onToggleDepartment: (departmentId: string) => void;
  onAddNew: () => void;
}

const StoreHierarchyTree: React.FC<StoreHierarchyTreeProps> = ({
  region,
  onToggleArea,
  onToggleStore,
  onToggleDepartment,
  onAddNew,
}) => {
  return (
    <div className="space-y-4">
      {region.areas.map((area) => {
        // Combine stores and departments to determine last item
        const allItems = [...area.stores, ...area.departments];
        const totalItems = allItems.length;

        return (
          <div key={area.id} className="relative">
            {/* Area Card */}
            <AreaCard area={area} onToggle={onToggleArea} />

            {/* Expanded Content */}
            {area.isExpanded && (
              <div className="relative ml-6 pl-6">
                {/* Stores */}
                {area.stores.map((store, storeIndex) => {
                  const isLastItem = storeIndex === area.stores.length - 1 && area.departments.length === 0;

                  return (
                    <div key={store.id} className="relative pt-4">
                      {/* Vertical line - from top to horizontal connector position */}
                      {/* py-5(20px) + half of card height (approx 50px) = 50px from pt-4 */}
                      <div className="absolute -left-6 top-0 h-[50px] w-0.5 bg-[#9B9B9B]" />

                      {/* Vertical line - continues down to next sibling (not for last item) */}
                      {!isLastItem && (
                        <div className="absolute -left-6 top-[50px] bottom-0 w-0.5 bg-[#9B9B9B]" />
                      )}

                      {/* Horizontal connector line - from vertical line to card */}
                      <div className="absolute -left-6 top-[50px] w-6 h-0.5 bg-[#9B9B9B]" />

                      <StoreCard
                        store={store}
                        onToggle={onToggleStore}
                      />
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
