// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'user';
}

// Notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Menu item interface
export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
  children?: MenuItem[];
}

// Theme type
export type Theme = 'light' | 'dark' | 'system';

// Language type
export type Language = 'vi-VN' | 'en-US' | 'ja-JP';

// Sidebar state
export interface SidebarState {
  isExpanded: boolean;
  activeItemId: string;
}
