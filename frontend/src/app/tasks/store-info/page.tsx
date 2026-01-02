'use client';

import React, { useState, useCallback } from 'react';
import { RegionId, Region, Area } from '@/types/storeInfo';
import { regionTabs, regionsMap, getRegionById } from '@/data/mockStoreInfo';
import StoreInfoHeader from '@/components/stores/StoreInfoHeader';
import RegionTabs from '@/components/stores/RegionTabs';
import StoreHierarchyTree from '@/components/stores/StoreHierarchyTree';

export default function StoreInformationPage() {
  const [activeTab, setActiveTab] = useState<RegionId>('OCEAN');
  const [regions, setRegions] = useState<Record<string, Region>>(regionsMap);

  const currentRegion = regions[activeTab];

  const handleTabChange = (tabId: RegionId) => {
    setActiveTab(tabId);
  };

  const handleToggleArea = useCallback((areaId: string) => {
    setRegions((prev) => {
      const region = prev[activeTab];
      if (!region) return prev;

      const updatedAreas = region.areas.map((area) =>
        area.id === areaId ? { ...area, isExpanded: !area.isExpanded } : area
      );

      return {
        ...prev,
        [activeTab]: { ...region, areas: updatedAreas },
      };
    });
  }, [activeTab]);

  const handleToggleStore = useCallback((storeId: string) => {
    setRegions((prev) => {
      const region = prev[activeTab];
      if (!region) return prev;

      const updatedAreas = region.areas.map((area) => ({
        ...area,
        stores: area.stores.map((store) =>
          store.id === storeId ? { ...store, isExpanded: !store.isExpanded } : store
        ),
      }));

      return {
        ...prev,
        [activeTab]: { ...region, areas: updatedAreas },
      };
    });
  }, [activeTab]);

  const handleToggleDepartment = useCallback((departmentId: string) => {
    setRegions((prev) => {
      const region = prev[activeTab];
      if (!region) return prev;

      const updatedAreas = region.areas.map((area) => ({
        ...area,
        departments: area.departments.map((dept) =>
          dept.id === departmentId ? { ...dept, isExpanded: !dept.isExpanded } : dept
        ),
      }));

      return {
        ...prev,
        [activeTab]: { ...region, areas: updatedAreas },
      };
    });
  }, [activeTab]);

  const handlePermissionsClick = () => {
    // TODO: Implement permissions modal
    console.log('Open permissions modal');
  };

  const handleImportClick = () => {
    // TODO: Implement import Excel modal
    console.log('Open import Excel modal');
  };

  const handleAddNew = () => {
    // TODO: Implement add new team or member modal
    console.log('Open add new modal');
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <StoreInfoHeader
          onPermissionsClick={handlePermissionsClick}
          onImportClick={handleImportClick}
        />

        {/* Region Tabs */}
        <RegionTabs
          tabs={regionTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Content - Hierarchy Tree */}
        {currentRegion && (
          <StoreHierarchyTree
            region={currentRegion}
            onToggleArea={handleToggleArea}
            onToggleStore={handleToggleStore}
            onToggleDepartment={handleToggleDepartment}
            onAddNew={handleAddNew}
          />
        )}
      </div>
    </div>
  );
}
