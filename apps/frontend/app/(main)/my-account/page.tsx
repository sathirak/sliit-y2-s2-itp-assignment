"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useUserMutations } from '@/lib/hooks/useUsers';
import { useCustomerOrders } from '@/lib/hooks/useOrders';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Card } from '@/modules/ui/card';
import { Button } from '@/modules/ui/button';
import { Input } from '@/modules/ui/input';
import { Label } from '@/modules/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/modules/ui/tabs';
import { Badge } from '@/modules/ui/badge';
import { 
  User, 
  Mail, 
  UserCheck, 
  Calendar, 
  Edit, 
  Package, 
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';

export default function MyAccountPage() {
  const { user, error, isLoading: userLoading } = useAuth();
  const { orders, isLoading: ordersLoading } = useCustomerOrders(user?.id || null);
  const { updateCurrentUser } = useUserMutations();
  const { setUser } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  // Initialize form when user data is loaded
  useEffect(() => {
    if (user && !isEditing) {
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [user, isEditing]);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

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

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form to current user data
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleUpdateProfile = async () => {
    setUpdateLoading(true);
    try {
      const updatedUser = await updateCurrentUser(editForm);
      // Update the auth store with the new user data
      setUser(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      // You could add a toast notification here
    } finally {
      setUpdateLoading(false);
    }
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-300"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="text-blue-600 border-blue-300"><Loader2 className="w-3 h-3 mr-1" />Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-600 border-green-300"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-600 border-red-300"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User size={16} />
              Profile
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package size={16} />
              My Orders
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Information Card */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <User size={20} />
                    Profile Information
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleEditToggle}
                    disabled={updateLoading}
                  >
                    <Edit size={16} className="mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
                
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={handleUpdateProfile} 
                        disabled={updateLoading}
                        className="flex-1"
                      >
                        {updateLoading ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Save Changes'
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
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
                )}
              </Card>

              {/* Account Summary Card */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="text-blue-600" size={24} />
                      <div>
                        <p className="font-semibold text-blue-900">Total Orders</p>
                        <p className="text-sm text-blue-600">All time purchases</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {ordersLoading ? '...' : orders.length}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="text-green-600" size={24} />
                      <div>
                        <p className="font-semibold text-green-900">Total Spent</p>
                        <p className="text-sm text-green-600">Lifetime value</p>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      $0.00
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Package size={20} />
                Order History
              </h2>
              
              {ordersLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="animate-spin" size={32} />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
                  <Button asChild>
                    <a href="/">Start Shopping</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="font-medium">Order #{order.id.slice(-8)}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getOrderStatusBadge(order.status)}
                        </div>
                      </div>
                      
                      <div className="border-t pt-3">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
