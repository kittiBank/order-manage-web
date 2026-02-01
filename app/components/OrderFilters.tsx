'use client';

import React from 'react';
import { OrderFilters } from '@/app/types/order';

interface OrderFiltersComponentProps {
  filters: OrderFilters;
  onFiltersChange: (filters: OrderFilters) => void;
}

export default function OrderFiltersComponent({
  filters,
  onFiltersChange,
}: OrderFiltersComponentProps) {
  const handleCustomerIdChange = (customerId: string) => {
    onFiltersChange({
      ...filters,
      customerId: customerId || undefined,
    });
  };

  const handleMinPriceChange = (value: string) => {
    const minPrice = value ? parseFloat(value) : undefined;
    onFiltersChange({ ...filters, minPrice });
  };

  const handleMaxPriceChange = (value: string) => {
    const maxPrice = value ? parseFloat(value) : undefined;
    onFiltersChange({ ...filters, maxPrice });
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status === 'all' ? undefined : (status as OrderFilters['status']),
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as OrderFilters['sortBy'],
    });
  };

  const resetFilters = () => {
    onFiltersChange({ sortBy: 'newest' });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-full h-[42px] px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 text-sm appearance-none cursor-pointer hover:border-gray-300 transition-colors"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Customer ID Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer ID
          </label>
          <input
            type="text"
            value={filters.customerId || ''}
            onChange={(e) => handleCustomerIdChange(e.target.value)}
            placeholder="e.g., CUST001"
            className="w-full h-[42px] px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 text-sm placeholder-gray-400 hover:border-gray-300 transition-colors"
          />
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Total (฿)
          </label>
          <input
            type="number"
            value={filters.minPrice || ''}
            onChange={(e) => handleMinPriceChange(e.target.value)}
            placeholder="0"
            className="w-full h-[42px] px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 text-sm placeholder-gray-400 hover:border-gray-300 transition-colors"
          />
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Total (฿)
          </label>
          <input
            type="number"
            value={filters.maxPrice || ''}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
            placeholder="999999"
            className="w-full h-[42px] px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 text-sm placeholder-gray-400 hover:border-gray-300 transition-colors"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            value={filters.sortBy || 'newest'}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full h-[42px] px-3 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-900 text-sm appearance-none cursor-pointer hover:border-gray-300 transition-colors"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="id-asc">Order ID: A-Z</option>
            <option value="id-desc">Order ID: Z-A</option>
            <option value="customer-asc">Customer: A-Z</option>
            <option value="customer-desc">Customer: Z-A</option>
          </select>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {(filters.status || filters.customerId || filters.minPrice || filters.maxPrice) && (
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-600">Active filters:</span>
          
          {filters.status && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Status: {filters.status}
              <button
                onClick={() => handleStatusChange('all')}
                className="ml-2 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.customerId && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Customer: {filters.customerId}
              <button
                onClick={() => handleCustomerIdChange('')}
                className="ml-2 hover:text-purple-900"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.minPrice && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Min: ฿{filters.minPrice}
              <button
                onClick={() => handleMinPriceChange('')}
                className="ml-2 hover:text-green-900"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.maxPrice && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Max: ฿{filters.maxPrice}
              <button
                onClick={() => handleMaxPriceChange('')}
                className="ml-2 hover:text-green-900"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          Reset All Filters
        </button>
      </div>
    </div>
  );
}
