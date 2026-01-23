'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { RegionId, Region, RegionTab, StoreStaff } from '@/types/storeInfo';
import {
  getStoreInfoRegionTabs,
  getStoreInfoRegionHierarchy,
  getStoreInfoStoresList,
  saveStorePermissions,
  importStoresFromFile,
  StoreListItem,
} from '@/lib/api';
import StoreInfoHeader from '@/components/stores/StoreInfoHeader';
import RegionTabs from '@/components/stores/RegionTabs';
import StoreHierarchyTree from '@/components/stores/StoreHierarchyTree';
import StorePermissionsModal from '@/components/stores/StorePermissionsModal';
import StoreImportExcelModal from '@/components/stores/StoreImportExcelModal';
import StaffDetailModal from '@/components/stores/StaffDetailModal';
import { StoreInfoPageSkeleton, HierarchySkeleton } from '@/components/ui/Skeleton';

export default function StoreInformationPage() {
  const [activeTab, setActiveTab] = useState<RegionId>('');
  const [regionTabs, setRegionTabs] = useState<RegionTab[]>([]);
  const [regions, setRegions] = useState<Record<string, Region>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isStaffDetailModalOpen, setIsStaffDetailModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StoreStaff | null>(null);
  const [storesList, setStoresList] = useState<StoreListItem[]>([]);

  const currentRegion = regions[activeTab];

  // Fetch region tabs on mount
  useEffect(() => {
    async function fetchTabs() {
      try {
        const tabs = await getStoreInfoRegionTabs();
        setRegionTabs(tabs);
        if (tabs.length > 0) {
          setActiveTab(tabs[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch region tabs:', err);
        setError('Failed to load region tabs');
      }
    }
    fetchTabs();
  }, []);

  // Fetch region hierarchy when active tab changes
  useEffect(() => {
    if (!activeTab) return;

    async function fetchHierarchy() {
      setLoading(true);
      setError(null);
      try {
        if (regions[activeTab]) {
          setLoading(false);
          return;
        }

        const regionData = await getStoreInfoRegionHierarchy(activeTab);
        setRegions((prev) => ({
          ...prev,
          [activeTab]: regionData,
        }));
      } catch (err) {
        console.error('Failed to fetch region hierarchy:', err);
        setError('Failed to load region data');
      } finally {
        setLoading(false);
      }
    }
    fetchHierarchy();
  }, [activeTab, regions]);

  // Fetch stores list when permissions modal opens
  useEffect(() => {
    if (isPermissionsModalOpen && storesList.length === 0) {
      async function fetchStores() {
        try {
          const stores = await getStoreInfoStoresList();
          setStoresList(stores);
        } catch (err) {
          console.error('Failed to fetch stores list:', err);
        }
      }
      fetchStores();
    }
  }, [isPermissionsModalOpen, storesList.length]);

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
    setIsPermissionsModalOpen(true);
  };

  const handleImportClick = () => {
    setIsImportModalOpen(true);
  };

  const handleAddNew = () => {
    // TODO: Implement add new store or staff modal
    console.log('Open add new modal');
  };

  const handleEditStaff = (staffId: string) => {
    // TODO: Implement edit staff modal
    console.log('Edit staff:', staffId);
  };

  const handleDeleteStaff = (staffId: string) => {
    // TODO: Implement delete staff confirmation
    console.log('Delete staff:', staffId);
  };

  const handleViewStaffDetail = (staff: StoreStaff) => {
    setSelectedStaff(staff);
    setIsStaffDetailModalOpen(true);
  };

  const handleSavePermissions = async (storeId: string, permissions: string[]) => {
    await saveStorePermissions({ storeId, permissions });
  };

  const handleImportStores = async (file: File) => {
    const result = await importStoresFromFile(file);

    // Refresh data if import was successful
    if (result.success && result.imported && result.imported > 0) {
      // Clear cached regions to force refresh
      setRegions({});
      // Refresh stores list for permissions modal
      setStoresList([]);
    }

    return result;
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

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4">
            {error}
          </div>
        )}

        {/* Loading State - Skeleton */}
        {loading && !currentRegion && (
          <HierarchySkeleton />
        )}

        {/* Content - Hierarchy Tree */}
        {currentRegion && (
          <StoreHierarchyTree
            region={currentRegion}
            onToggleArea={handleToggleArea}
            onToggleStore={handleToggleStore}
            onToggleDepartment={handleToggleDepartment}
            onAddNew={handleAddNew}
            onViewStaffDetail={handleViewStaffDetail}
            onEditStaff={handleEditStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        )}
      </div>

      {/* Permissions Modal */}
      <StorePermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        onSave={handleSavePermissions}
        stores={storesList}
      />

      {/* Import Excel Modal */}
      <StoreImportExcelModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportStores}
      />

      {/* Staff Detail Modal */}
      <StaffDetailModal
        isOpen={isStaffDetailModalOpen}
        onClose={() => setIsStaffDetailModalOpen(false)}
        staff={selectedStaff}
      />
    </div>
  );
}
