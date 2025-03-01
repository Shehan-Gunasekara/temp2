import { useState } from 'react';
import { NavigationState, NavItem } from './types';

const defaultNavItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'gallery', label: 'Gallery', href: '/gallery' },
  { id: 'explore', label: 'Explore', href: '/explore' },
  { id: 'pricing', label: 'Pricing', href: '/pricing' },
];

export function useNavigation(): NavigationState {
  const [activeTab, setActiveTab] = useState('home');

  return {
    activeTab,
    setActiveTab,
    navItems: defaultNavItems,
  };
}