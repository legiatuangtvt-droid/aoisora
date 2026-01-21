'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getScopeHierarchy, ScopeRegion, getStoreStaff, StoreStaffOption } from '@/lib/api';
import type { DropdownOption } from '@/types/addTask';

interface UseScopeDataReturn {
  // Options for dropdowns (4 levels)
  regionOptions: DropdownOption[];
  zoneOptions: DropdownOption[];
  areaOptions: DropdownOption[];
  storeOptions: DropdownOption[];

  // Loading state (single state for all)
  isLoading: boolean;

  // Legacy loading states (for backward compatibility)
  isLoadingRegions: boolean;
  isLoadingZones: boolean;
  isLoadingAreas: boolean;
  isLoadingStores: boolean;

  // Error state
  error: string | null;

  // Legacy error states (for backward compatibility)
  regionsError: string | null;
  zonesError: string | null;
  areasError: string | null;
  storesError: string | null;

  // Total counts
  totalStores: number;

  // Functions to filter by hierarchy
  getZonesByRegion: (regionId: string) => DropdownOption[];
  getAreasByZone: (zoneId: string) => DropdownOption[];
  getStoresByArea: (areaId: string) => DropdownOption[];
  getStoresByRegion: (regionId: string) => DropdownOption[];

  // Functions to get staff by store (async - calls API)
  getStaffByStore: (storeId: string) => Promise<{
    leaders: DropdownOption[];
    staff: DropdownOption[];
  }>;

  // Refresh function (single refresh for all)
  refresh: () => Promise<void>;

  // Legacy refresh functions (for backward compatibility)
  refreshRegions: () => Promise<void>;
  refreshZones: () => Promise<void>;
  refreshAreas: () => Promise<void>;
  refreshStores: () => Promise<void>;
}

// Internal data structures for filtering
interface ZoneData {
  id: number;
  name: string;
  regionId: number;
}

interface AreaData {
  id: number;
  name: string;
  zoneId: number;
}

interface StoreData {
  id: number;
  name: string;
  areaId: number;
}

export function useScopeData(): UseScopeDataReturn {
  // Single loading & error state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Raw hierarchy data
  const [regions, setRegions] = useState<ScopeRegion[]>([]);

  // Fetch all scope data in one API call
  const fetchScopeData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getScopeHierarchy();
      setRegions(response.regions);
    } catch (err) {
      console.error('Failed to fetch scope hierarchy:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch scope data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Flatten data for filtering
  const { allZones, allAreas, allStores } = useMemo(() => {
    const zones: ZoneData[] = [];
    const areas: AreaData[] = [];
    const stores: StoreData[] = [];

    regions.forEach(region => {
      region.zones.forEach(zone => {
        zones.push({
          id: zone.zone_id,
          name: zone.zone_name,
          regionId: region.region_id,
        });

        zone.areas.forEach(area => {
          areas.push({
            id: area.area_id,
            name: area.area_name,
            zoneId: zone.zone_id,
          });

          area.stores.forEach(store => {
            stores.push({
              id: store.store_id,
              name: store.store_name,
              areaId: area.area_id,
            });
          });
        });
      });
    });

    return { allZones: zones, allAreas: areas, allStores: stores };
  }, [regions]);

  // Create dropdown options
  const regionOptions = useMemo<DropdownOption[]>(() =>
    regions.map(r => ({ value: String(r.region_id), label: r.region_name })),
    [regions]
  );

  const zoneOptions = useMemo<DropdownOption[]>(() =>
    allZones.map(z => ({ value: String(z.id), label: z.name })),
    [allZones]
  );

  const areaOptions = useMemo<DropdownOption[]>(() =>
    allAreas.map(a => ({ value: String(a.id), label: a.name })),
    [allAreas]
  );

  const storeOptions = useMemo<DropdownOption[]>(() =>
    allStores.map(s => ({ value: String(s.id), label: s.name })),
    [allStores]
  );

  // Filter functions
  const getZonesByRegion = useCallback((regionId: string): DropdownOption[] => {
    if (!regionId) return zoneOptions;

    return allZones
      .filter(z => String(z.regionId) === regionId)
      .map(z => ({ value: String(z.id), label: z.name }));
  }, [allZones, zoneOptions]);

  const getAreasByZone = useCallback((zoneId: string): DropdownOption[] => {
    if (!zoneId) return areaOptions;

    return allAreas
      .filter(a => String(a.zoneId) === zoneId)
      .map(a => ({ value: String(a.id), label: a.name }));
  }, [allAreas, areaOptions]);

  const getStoresByArea = useCallback((areaId: string): DropdownOption[] => {
    if (!areaId) return storeOptions;

    return allStores
      .filter(s => String(s.areaId) === areaId)
      .map(s => ({ value: String(s.id), label: s.name }));
  }, [allStores, storeOptions]);

  const getStoresByRegion = useCallback((regionId: string): DropdownOption[] => {
    if (!regionId) return storeOptions;

    // Get zone IDs in this region
    const zoneIds = allZones
      .filter(z => String(z.regionId) === regionId)
      .map(z => z.id);

    // Get area IDs in those zones
    const areaIds = allAreas
      .filter(a => zoneIds.includes(a.zoneId))
      .map(a => a.id);

    // Get stores in those areas
    return allStores
      .filter(s => areaIds.includes(s.areaId))
      .map(s => ({ value: String(s.id), label: s.name }));
  }, [allZones, allAreas, allStores, storeOptions]);

  // Get staff by store (async - calls API)
  const getStaffByStore = useCallback(async (storeId: string): Promise<{
    leaders: DropdownOption[];
    staff: DropdownOption[];
  }> => {
    if (!storeId) {
      return { leaders: [], staff: [] };
    }

    try {
      const response = await getStoreStaff(Number(storeId));
      return {
        leaders: response.leaders.map(l => ({ value: l.value, label: l.label })),
        staff: response.staff.map(s => ({ value: s.value, label: s.label })),
      };
    } catch (err) {
      console.error('Failed to fetch store staff:', err);
      return { leaders: [], staff: [] };
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchScopeData();
  }, [fetchScopeData]);

  return {
    // Dropdown options
    regionOptions,
    zoneOptions,
    areaOptions,
    storeOptions,

    // Loading states
    isLoading,
    isLoadingRegions: isLoading,
    isLoadingZones: isLoading,
    isLoadingAreas: isLoading,
    isLoadingStores: isLoading,

    // Error states
    error,
    regionsError: error,
    zonesError: error,
    areasError: error,
    storesError: error,

    // Counts
    totalStores: allStores.length,

    // Filter functions
    getZonesByRegion,
    getAreasByZone,
    getStoresByArea,
    getStoresByRegion,
    getStaffByStore,

    // Refresh functions
    refresh: fetchScopeData,
    refreshRegions: fetchScopeData,
    refreshZones: fetchScopeData,
    refreshAreas: fetchScopeData,
    refreshStores: fetchScopeData,
  };
}
