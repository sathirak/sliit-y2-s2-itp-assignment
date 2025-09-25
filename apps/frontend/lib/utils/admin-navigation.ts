import { Package, FileText, Users, CreditCard, Ticket, LucideIcon } from 'lucide-react';
import { UserDto } from '@/lib/dtos/user';

export interface NavigationItem {
  href: string;
  icon: LucideIcon;
  label: string;
  roles: UserDto['roleName'][];
}

export const ALL_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    href: '/admin/product-management',
    icon: Package,
    label: 'Products',
    roles: ['owner']
  },
  {
    href: '/admin/tickets',
    icon: Ticket,
    label: 'Tickets',
    roles: ['owner', 'sales_rep']
  },
  {
    href: '/admin/billing',
    icon: CreditCard,
    label: 'Billing',
    roles: ['owner']
  },
  {
    href: '/admin/contract-management',
    icon: FileText,
    label: 'Contracts',
    roles: ['owner', 'supplier']
  },
  {
    href: '/admin/users',
    icon: Users,
    label: 'Users',
    roles: ['owner']
  }
];

/**
 * Get navigation items based on user role
 * @param userRole - The role of the current user
 * @returns Array of navigation items the user can access
 */
export const getNavigationItemsByRole = (userRole: UserDto['roleName'] | undefined): NavigationItem[] => {
  if (!userRole) {
    return [];
  }

  return ALL_NAVIGATION_ITEMS.filter(item => 
    item.roles.includes(userRole)
  );
};

/**
 * Check if user has access to a specific route
 * @param route - The route to check access for
 * @param userRole - The role of the current user
 * @returns Boolean indicating if user has access
 */
export const hasRouteAccess = (route: string, userRole: UserDto['roleName'] | undefined): boolean => {
  if (!userRole) {
    return false;
  }

  // Allow all admin users to access the main admin dashboard
  if (route === '/admin') {
    return ['owner', 'sales_rep', 'supplier'].includes(userRole);
  }

  // Check specific route access
  const item = ALL_NAVIGATION_ITEMS.find(navItem => navItem.href === route);
  return item ? item.roles.includes(userRole) : false;
};

/**
 * Get user role display name
 * @param role - The user role
 * @returns Formatted role name for display
 */
export const getRoleDisplayName = (role: UserDto['roleName']): string => {
  const roleNames = {
    'owner': 'Owner',
    'sales_rep': 'Sales Representative',
    'supplier': 'Supplier',
    'customer': 'Customer'
  };
  
  return roleNames[role] || role;
};