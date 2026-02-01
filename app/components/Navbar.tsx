'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/app/contexts/UserContext';
import { showSuccessAlert, showConfirmDialog } from '@/lib/sweetAlert';

export default function Navbar() {
  const { user, logout } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await showConfirmDialog(
      'Logout',
      'Are you sure you want to logout?',
      'Yes, Logout'
    );

    if (result.isConfirmed) {
      await logout();
      showSuccessAlert('Logged Out', 'You have been successfully logged out');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'SELLER':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'CUSTOMER':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-blue-600">Order Management</h1>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {/* User Details - Hidden on mobile */}
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                {user.role}
              </span>
            </div>

            {/* User Avatar */}
            <div className="flex items-center space-x-2">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-10 w-10 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm border-2 border-blue-500">
                  {getInitials(user.name)}
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-white text-red-600 text-sm font-medium rounded-lg border-2 border-red-600 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
