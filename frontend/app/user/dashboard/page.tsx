'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3, Droplet, FileText, Bell, User, Settings, LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProfileComponent from '@/components/dashboard/profile';
import SettingsPage from '@/components/dashboard/settings';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'tds', label: 'Water TDS', icon: Droplet },
  { id: 'bills', label: 'Billing', icon: FileText },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings }
] as const;

type ViewType = typeof NAV_ITEMS[number]['id'];

const WaterCareDashboard = () => {
  const { authenticated, isUser, user, logout, authLoading } = useAuth();
  const router = useRouter();

  const [view, setView] = useState<ViewType>('overview');

  useEffect(() => {
    if (!authLoading && (!authenticated || !isUser)) {
      router.push('/user/signin');
    }
  }, [authenticated, isUser, authLoading, router]);

  const handleLogout = async () => {
    await logout();
    alert("Logged out successfully");
    router.push('/user/signin');
  };

  const renderView = () => {
    switch (view) {
      case 'overview':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user?.name || 'User'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Your water usage summary and alerts will appear here.</p>
            </CardContent>
          </Card>
        );
      case 'tds':
        return <Card><CardHeader><CardTitle>Water TDS</CardTitle></CardHeader><CardContent><p>Live water TDS .</p></CardContent></Card>;
      case 'bills':
        return <Card><CardHeader><CardTitle>Billing</CardTitle></CardHeader><CardContent><p>View your bills and payment history.</p></CardContent></Card>;
      case 'alerts':
        return <Card><CardHeader><CardTitle>Alerts</CardTitle></CardHeader><CardContent><p>Active alerts and notifications.</p></CardContent></Card>;
      case 'profile':
        return <ProfileComponent />
      case 'settings':
        return <SettingsPage />
      default:
        return null;
    }
  };

  if (authLoading) return <p>Loading...</p>;

  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-gray-100 p-4 flex flex-col">
        <div className="mb-6 font-bold text-xl">WaterCare Dashboard</div>
        <ul className="flex-grow">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <li key={id} className={`mb-2 cursor-pointer flex items-center p-2 rounded ${view === id ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`} onClick={() => setView(id)}>
              <Icon className="mr-2" size={18} />
              {label}
            </li>
          ))}
        </ul>
        <Button variant="ghost" onClick={handleLogout} className="flex items-center mt-auto text-red-600">
          <LogOut className="mr-2" size={18} /> Logout
        </Button>
      </nav>
      <main className="flex-1 p-6 overflow-auto bg-white">
        {renderView()}
      </main>
    </div>
  );
};

export default WaterCareDashboard;
