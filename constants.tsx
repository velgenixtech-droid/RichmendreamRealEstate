import React from 'react';
import { LayoutDashboard, Building2, Handshake, DollarSign, Users, LucideIcon, UserPlus, FileText, Trophy, Phone, Settings, FilePieChart, Mail } from 'lucide-react';
import { UserRole } from './types';

interface NavItem {
  path: string;
  name: string;
  icon: LucideIcon;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    path: '/',
    name: 'Dashboard',
    icon: LayoutDashboard,
    roles: [UserRole.Admin, UserRole.Agent, UserRole.Viewer],
  },
  {
    path: '/properties',
    name: 'Properties',
    icon: Building2,
    roles: [UserRole.Admin, UserRole.Agent, UserRole.Viewer],
  },
  {
    path: '/deals',
    name: 'Deals',
    icon: Handshake,
    roles: [UserRole.Admin, UserRole.Agent],
  },
  {
    path: '/commissions',
    name: 'Commissions',
    icon: DollarSign,
    roles: [UserRole.Admin, UserRole.Agent],
  },
  {
    path: '/leads',
    name: 'Leads',
    icon: UserPlus,
    roles: [UserRole.Admin, UserRole.Agent],
  },
  {
    path: '/agents',
    name: 'Agents',
    icon: Trophy,
    roles: [UserRole.Admin, UserRole.Agent],
  },
  {
    path: '/documents',
    name: 'Documents',
    icon: FileText,
    roles: [UserRole.Admin, UserRole.Agent],
  },
  {
    path: '/calls',
    name: 'Calls',
    icon: Phone,
    roles: [UserRole.Admin, UserRole.Agent],
  },
  {
    path: '/emails',
    name: 'Emails',
    icon: Mail,
    roles: [UserRole.Admin, UserRole.Agent],
  },
  {
    path: '/reports',
    name: 'Reports',
    icon: FilePieChart,
    roles: [UserRole.Admin, UserRole.Agent],
  },
  {
    path: '/users',
    name: 'User Management',
    icon: Users,
    roles: [UserRole.Admin],
  },
  {
    path: '/profile',
    name: 'Profile',
    icon: Settings,
    roles: [UserRole.Admin, UserRole.Agent, UserRole.Viewer],
  },
];