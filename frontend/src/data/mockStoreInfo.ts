import { Region, RegionTab, Area, Store, StoreDepartment, StoreStaff } from '@/types/storeInfo';

// Region tabs data
export const regionTabs: RegionTab[] = [
  { id: 'SMBU', label: 'SMBU (Store)' },
  { id: 'OCEAN', label: 'OCEAN' },
  { id: 'HA_NOI_CENTER', label: 'HA NOI CENTER' },
  { id: 'ECO_PARK', label: 'ECO PARK' },
  { id: 'HA_DONG', label: 'HA DONG' },
  { id: 'NGD', label: 'NGD' },
];

// Store staff mock data
const storeManager: StoreStaff = {
  id: 'sm-1',
  name: 'Hoang Huong Giang',
  avatar: '/avatars/manager-1.jpg',
  position: 'Store Manager',
  jobGrade: 'G3',
};

const staffList: StoreStaff[] = [
  {
    id: 'staff-1',
    name: 'Nguyen Van A',
    avatar: '/avatars/staff-1.jpg',
    position: 'Sales Staff',
    jobGrade: 'G2',
  },
  {
    id: 'staff-2',
    name: 'Tran Thi B',
    avatar: '/avatars/staff-2.jpg',
    position: 'Cashier',
    jobGrade: 'G1',
  },
  {
    id: 'staff-3',
    name: 'Le Van C',
    avatar: '/avatars/staff-3.jpg',
    position: 'Stock Keeper',
    jobGrade: 'G1',
  },
];

// Store mock data
const oceanParkStore: Store = {
  id: 'store-3016',
  code: '3016',
  name: 'Ocean Park s203',
  manager: storeManager,
  staffCount: 15,
  staffList: staffList,
  isExpanded: false,
};

// Department mock data for stores
const zenParkDepartment: StoreDepartment = {
  id: 'dept-zenpark',
  name: 'ZEN PARK',
  icon: 'park',
  iconColor: '#109A4A',
  iconBg: 'rgba(16, 154, 74, 0.1)',
  isExpanded: false,
};

const controlDepartment: StoreDepartment = {
  id: 'dept-control',
  name: 'CONTROL',
  icon: 'control',
  iconColor: '#7C3AED',
  iconBg: 'rgba(124, 58, 237, 0.1)',
  isExpanded: false,
};

const improvementDepartment: StoreDepartment = {
  id: 'dept-improvement',
  name: 'IMPROVEMENT',
  icon: 'rocket',
  iconColor: '#2563EB',
  iconBg: 'rgba(37, 99, 235, 0.1)',
  isExpanded: false,
};

const hrDepartment: StoreDepartment = {
  id: 'dept-hr',
  name: 'HR',
  icon: 'hr',
  iconColor: '#E11D48',
  iconBg: 'rgba(225, 29, 72, 0.1)',
  isExpanded: false,
};

// Area mock data
const oceanArea: Area = {
  id: 'area-ocean',
  name: 'Miền Bắc - OCEAN AREA',
  storeCount: 23,
  stores: [oceanParkStore],
  departments: [zenParkDepartment, controlDepartment, improvementDepartment, hrDepartment],
  isExpanded: true,
};

// Region mock data
export const oceanRegion: Region = {
  id: 'OCEAN',
  name: 'OCEAN',
  label: 'OCEAN',
  areas: [oceanArea],
};

export const smbuRegion: Region = {
  id: 'SMBU',
  name: 'SMBU',
  label: 'SMBU (Store)',
  areas: [
    {
      id: 'area-smbu-1',
      name: 'Tổng quan SMBU',
      storeCount: 150,
      stores: [],
      departments: [],
      isExpanded: false,
    },
  ],
};

export const haNoiCenterRegion: Region = {
  id: 'HA_NOI_CENTER',
  name: 'HA NOI CENTER',
  label: 'HA NOI CENTER',
  areas: [
    {
      id: 'area-hanoi-1',
      name: 'Khu vực Hà Nội Trung Tâm',
      storeCount: 45,
      stores: [],
      departments: [],
      isExpanded: false,
    },
  ],
};

export const ecoParkRegion: Region = {
  id: 'ECO_PARK',
  name: 'ECO PARK',
  label: 'ECO PARK',
  areas: [
    {
      id: 'area-ecopark-1',
      name: 'Khu vực Eco Park',
      storeCount: 12,
      stores: [],
      departments: [],
      isExpanded: false,
    },
  ],
};

export const haDongRegion: Region = {
  id: 'HA_DONG',
  name: 'HA DONG',
  label: 'HA DONG',
  areas: [
    {
      id: 'area-hadong-1',
      name: 'Khu vực Hà Đông',
      storeCount: 18,
      stores: [],
      departments: [],
      isExpanded: false,
    },
  ],
};

export const ngdRegion: Region = {
  id: 'NGD',
  name: 'NGD',
  label: 'NGD',
  areas: [
    {
      id: 'area-ngd-1',
      name: 'Khu vực NGD',
      storeCount: 8,
      stores: [],
      departments: [],
      isExpanded: false,
    },
  ],
};

// All regions map
export const regionsMap: Record<string, Region> = {
  SMBU: smbuRegion,
  OCEAN: oceanRegion,
  HA_NOI_CENTER: haNoiCenterRegion,
  ECO_PARK: ecoParkRegion,
  HA_DONG: haDongRegion,
  NGD: ngdRegion,
};

// Get region by ID
export const getRegionById = (regionId: string): Region | undefined => {
  return regionsMap[regionId];
};
