'use client';

import React, { useState, useMemo } from 'react';
import { Order, OrderFilters, OrderFormData } from '@/app/types/order';
import { mockOrders } from '@/lib/mockOrders';
import OrderTable from '@/app/components/OrderTable';
import OrderFiltersComponent from '@/app/components/OrderFilters';
import OrderModal from '@/app/components/OrderModal';
import { showSuccessAlert, showConfirmDialog } from '@/lib/sweetAlert';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filters, setFilters] = useState<OrderFilters>({ sortBy: 'newest' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [displayCount, setDisplayCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and Sort Logic
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Filter by category
    if (filters.category) {
      result = result.filter((order) => order.category === filters.category);
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      result = result.filter((order) => order.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((order) => order.price <= filters.maxPrice!);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [orders, filters]);

  // Pagination: Show only displayCount items
  const displayedOrders = filteredOrders.slice(0, displayCount);
  const hasMore = displayCount < filteredOrders.length;

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setDisplayCount((prev) => prev + 5);
      setIsLoading(false);
    }, 500);
  };

  const handleCreateOrder = (formData: OrderFormData) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString(),
    };
    setOrders([newOrder, ...orders]);
    setIsModalOpen(false);
    showSuccessAlert('Order Created!', 'New order has been added successfully');
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateOrder = (formData: OrderFormData) => {
    if (editingOrder) {
      setOrders(
        orders.map((order) =>
          order.id === editingOrder.id
            ? { ...order, ...formData }
            : order
        )
      );
      setEditingOrder(null);
      setIsModalOpen(false);
      showSuccessAlert('Order Updated!', 'Order has been updated successfully');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const result = await showConfirmDialog(
      'Delete Order?',
      'Are you sure you want to delete this order? This action cannot be undone.',
      'Yes, delete it!',
      'Cancel'
    );
    
    if (result.isConfirmed) {
      setOrders(orders.filter((order) => order.id !== orderId));
      showSuccessAlert('Deleted!', 'Order has been deleted successfully');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Order Management</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage your orders with ease. Total: {filteredOrders.length} orders
              </p>
            </div>
            <button
              onClick={() => {
                setEditingOrder(null);
                setIsModalOpen(true);
              }}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
            >
              + Create Order
            </button>
          </div>
        </div>

        {/* Filters */}
        <OrderFiltersComponent filters={filters} onFiltersChange={setFilters} />

        {/* Table */}
        {displayedOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new order.
            </p>
          </div>
        ) : (
          <>
            <OrderTable
              orders={displayedOrders}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrder}
            />

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    `Load More (${filteredOrders.length - displayCount} remaining)`
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        <OrderModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={editingOrder ? handleUpdateOrder : handleCreateOrder}
          order={editingOrder}
        />
      </div>
    </div>
  );
}
