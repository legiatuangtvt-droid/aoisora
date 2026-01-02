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
      {region.areas.map((area, areaIndex) => (
        <div key={area.id} className="relative">
          {/* Area Card */}
          <AreaCard area={area} onToggle={onToggleArea} />

          {/* Expanded Content */}
          {area.isExpanded && (
            <div className="relative mt-4 ml-5">
              {/* Vertical Connector Line */}
              <div
                className="absolute left-0 top-0 w-px bg-[#9B9B9B]"
                style={{
                  height: `calc(100% - 30px)`,
                }}
              />

              {/* Stores */}
              {area.stores.map((store, storeIndex) => (
                <div key={store.id} className="mb-4">
                  <StoreCard
                    store={store}
                    onToggle={onToggleStore}
                    hasConnector={true}
                  />
                </div>
              ))}

              {/* Departments */}
              {area.departments.map((department, deptIndex) => (
                <div key={department.id} className="mb-4">
                  <StoreDepartmentCard
                    department={department}
                    onToggle={onToggleDepartment}
                    hasConnector={true}
                  />
                </div>
              ))}

              {/* Add New Button */}
              <div className="ml-10 mt-4">
                <AddNewButton onClick={onAddNew} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StoreHierarchyTree;
