"use client";

import { useAuth } from '@/modules/auth/hooks/useAuth';
import { getNavigationItemsByRole, getRoleDisplayName } from '@/lib/utils/admin-navigation';
import Link from 'next/link';

export default function Page() {
    const { user } = useAuth();
    const navigationItems = getNavigationItemsByRole(user?.roleName);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome back, {user.firstName || 'Admin'}! 👋
                </h1>
                <p className="text-gray-600 mb-4">
                    You're signed in as <span className="font-semibold text-blue-700">{getRoleDisplayName(user.roleName)}</span>
                </p>
                
                {/* Role-specific welcome message */}
                <div className="bg-white/50 rounded-md p-4 border border-blue-100">
                    {user.roleName === 'owner' && (
                        <p className="text-sm text-gray-700">
                            🏛️ As the Owner, you have full access to all administrative features including products, users, billing, contracts, and tickets management.
                        </p>
                    )}
                    {user.roleName === 'sales_rep' && (
                        <p className="text-sm text-gray-700">
                            🎯 As a Sales Representative, you can manage customer tickets and support requests to help provide excellent customer service.
                        </p>
                    )}
                    {user.roleName === 'supplier' && (
                        <p className="text-sm text-gray-700">
                            🤝 As a Supplier, you can view and manage contracts related to your products and services.
                        </p>
                    )}
                </div>
            </div>

            {/* Quick Access Cards */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <Link key={item.href} href={item.href}>
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 hover:border-blue-300 cursor-pointer group">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                            <IconComponent size={24} className="text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                            {item.label}
                                        </h3>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {getDescriptionForModule(item.label)}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function getDescriptionForModule(label: string): string {
    const descriptions = {
        'Products': 'Manage product catalog, inventory, and pricing',
        'Tickets': 'Handle customer support requests and inquiries', 
        'Billing': 'Process payments and manage financial records',
        'Contracts': 'View and manage supplier agreements',
        'Users': 'Manage user accounts and permissions'
    };
    
    return descriptions[label as keyof typeof descriptions] || 'Manage this section';
}