"use client";

import { useAuth } from '@/modules/auth/hooks/useAuth';
import { Card } from '@/modules/ui/card';
import { Button } from '@/modules/ui/button';
import { User, Mail, UserCheck, Calendar } from 'lucide-react';

export default function MyAccountPage() {
  const { user, error } = useAuth();

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <div className="text-lg">Please sign in to view your account</div>
        <Button>
          <a href="/sign-in">Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={20} />
              Personal Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Mail size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <UserCheck size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Role</p>
                  <p className="font-medium capitalize">{user.roleName.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Calendar size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Account Actions Card */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
            
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                Edit Profile
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                Change Password
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                Order History
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                Wishlist
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                Support Tickets
              </Button>
            </div>
          </Card>
        </div>

        {/* Account Summary Card */}
        <Card className="mt-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600">0</h3>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-600">0</h3>
              <p className="text-sm text-gray-600">Wishlist Items</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="text-2xl font-bold text-purple-600">0</h3>
              <p className="text-sm text-gray-600">Support Tickets</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
