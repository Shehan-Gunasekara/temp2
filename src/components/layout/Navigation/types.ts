export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface NavigationState {
  activeTab: string;
  setActiveTab: (id: string) => void;
  navItems: NavItem[];
}