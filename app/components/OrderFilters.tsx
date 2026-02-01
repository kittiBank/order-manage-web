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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Total: Low to High</option>
            <option value="price-desc">Total: High to Low</option>
            <option value="customer-asc">Customer: A-Z</option>
            <option value="customer-desc">Customer: Z-A</option>
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={resetFilters}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
