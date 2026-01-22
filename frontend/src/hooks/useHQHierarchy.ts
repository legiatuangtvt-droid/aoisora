'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getHQHierarchy, HQDivision, HQDepartment, HQTeam, HQUser } from '@/lib/api';
import type { DropdownOption } from '@/types/addTask';

interface UseHQHierarchyReturn {
  // Options for dropdowns (4 levels - mapped to match ScopeSection props)
  regionOptions: DropdownOption[];  // Divisions
  zoneOptions: DropdownOption[];    // Departments
  areaOptions: DropdownOption[];    // Teams
  storeOptions: DropdownOption[];   // Users

  // Loading state
  isLoading: boolean;
  isLoadingRegions: boolean;
  isLoadingZones: boolean;
  isLoadingAreas: boolean;
  isLoadingStores: boolean;

  // Error state
  error: string | null;
  regionsError: string | null;
  zonesError: string | null;
  areasError: string | null;
  storesError: string | null;

  // Total counts
  totalStores: number;  // Total users

  // Functions to filter by hierarchy
  getZonesByRegion: (divisionId: string) => DropdownOption[];     // Depts by Division
  getAreasByZone: (departmentId: string) => DropdownOption[];     // Teams by Dept
  getStoresByArea: (teamId: string) => DropdownOption[];          // Users by Team
  getStoresByRegion: (divisionId: string) => DropdownOption[];    // Users by Division

  // Refresh function
  refresh: () => Promise<void>;
  refreshRegions: () => Promise<void>;
  refreshZones: () => Promise<void>;
  refreshAreas: () => Promise<void>;
  refreshStores: () => Promise<void>;
}

// Internal data structures for filtering
interface DeptData {
  id: number;
  name: string;
  divisionId: number;
}

interface TeamData {
  id: string;
  name: string;
  departmentId: number;
}

interface UserData {
  id: number;
  name: string;
  teamId: string;
  departmentId: number;
}

export function useHQHierarchy(): UseHQHierarchyReturn {
  // Single loading & error state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Raw hierarchy data
  const [divisions, setDivisions] = useState<HQDivision[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch all HQ hierarchy data in one API call
  const fetchHQData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getHQHierarchy();
      setDivisions(response.divisions);
      setTotalUsers(response.meta.total_users);
    } catch (err) {
      console.error('Failed to fetch HQ hierarchy:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch HQ data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Flatten data for filtering
  const { allDepts, allTeams, allUsers } = useMemo(() => {
    const depts: DeptData[] = [];
    const teams: TeamData[] = [];
    const users: UserData[] = [];

    divisions.forEach(division => {
      division.departments.forEach(dept => {
        depts.push({
          id: dept.department_id,
          name: dept.department_name,
          divisionId: division.division_id,
        });

        dept.teams.forEach(team => {
          const teamDeptId = dept.department_id;
          teams.push({
            id: team.team_id,
            name: team.team_name,
            departmentId: teamDeptId,
          });

          team.users.forEach(user => {
            users.push({
              id: user.user_id,
              name: user.user_name,
              teamId: team.team_id,
              departmentId: teamDeptId,
            });
          });
        });
      });
    });

    return { allDepts: depts, allTeams: teams, allUsers: users };
  }, [divisions]);

  // Create dropdown options (mapped to match ScopeSection props)
  const regionOptions = useMemo<DropdownOption[]>(() =>
    divisions.map(d => ({ value: String(d.division_id), label: d.division_name })),
    [divisions]
  );

  const zoneOptions = useMemo<DropdownOption[]>(() =>
    allDepts.map(d => ({ value: String(d.id), label: d.name })),
    [allDepts]
  );

  const areaOptions = useMemo<DropdownOption[]>(() =>
    allTeams.map(t => ({ value: t.id, label: t.name })),
    [allTeams]
  );

  const storeOptions = useMemo<DropdownOption[]>(() =>
    allUsers.map(u => ({ value: String(u.id), label: u.name })),
    [allUsers]
  );

  // Filter functions (mapped to match useScopeData interface)
  const getZonesByRegion = useCallback((divisionId: string): DropdownOption[] => {
    if (!divisionId) return zoneOptions;

    return allDepts
      .filter(d => String(d.divisionId) === divisionId)
      .map(d => ({ value: String(d.id), label: d.name }));
  }, [allDepts, zoneOptions]);

  const getAreasByZone = useCallback((departmentId: string): DropdownOption[] => {
    if (!departmentId) return areaOptions;

    return allTeams
      .filter(t => String(t.departmentId) === departmentId)
      .map(t => ({ value: t.id, label: t.name }));
  }, [allTeams, areaOptions]);

  const getStoresByArea = useCallback((teamId: string): DropdownOption[] => {
    if (!teamId) return storeOptions;

    return allUsers
      .filter(u => u.teamId === teamId)
      .map(u => ({ value: String(u.id), label: u.name }));
  }, [allUsers, storeOptions]);

  const getStoresByRegion = useCallback((divisionId: string): DropdownOption[] => {
    if (!divisionId) return storeOptions;

    // Get dept IDs in this division
    const deptIds = allDepts
      .filter(d => String(d.divisionId) === divisionId)
      .map(d => d.id);

    // Get users in those departments
    return allUsers
      .filter(u => deptIds.includes(u.departmentId))
      .map(u => ({ value: String(u.id), label: u.name }));
  }, [allDepts, allUsers, storeOptions]);

  // Initial fetch
  useEffect(() => {
    fetchHQData();
  }, [fetchHQData]);

  return {
    // Dropdown options (mapped to ScopeSection prop names)
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
    totalStores: totalUsers,

    // Filter functions
    getZonesByRegion,
    getAreasByZone,
    getStoresByArea,
    getStoresByRegion,

    // Refresh functions
    refresh: fetchHQData,
    refreshRegions: fetchHQData,
    refreshZones: fetchHQData,
    refreshAreas: fetchHQData,
    refreshStores: fetchHQData,
  };
}
