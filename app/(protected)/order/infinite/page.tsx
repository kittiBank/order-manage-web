'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Order as APIOrder, ordersAPI, GetOrdersQuery } from '@/lib/api/orders';
import { OrderFilters, OrderFormData } from '@/app/types/order';
import OrderTable from '@/app/components/OrderTable';
import OrderFiltersComponent from '@/app/components/OrderFilters';
import OrderModal from '@/app/components/OrderModal';
import { showSuccessAlert, showConfirmDialog, showErrorAlert } from '@/lib/sweetAlert';
import { useUser } from '@/app/contexts/UserContext';
import { useUrlState } from '@/app/hooks/useUrlState';

export default function OrdersPage() {
  const { user, accessToken } = useUser();
  const queryClient = useQueryClient();
  
  // Use URL state for filters - supports sharing, back/forward, refresh
  const [urlFilters, setUrlFilters] = useUrlState(
    {
      sortBy: 'newest' as OrderFilters['sortBy'],
      status: undefined as OrderFilters['status'],
      customerId: undefined as string | undefined,
      minPrice: undefined as number | undefined,
      maxPrice: undefined as number | undefined,
      cursor: undefined as string | undefined,
    },
    { replace: true, debounce: 300 }
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<APIOrder | null>(null);
  const limit = 10;

  // Convert URL filters to OrderFilters type
  const filters: OrderFilters = {
    sortBy: urlFilters.sortBy,
    status: urlFilters.status,
    customerId: urlFilters.customerId,
    minPrice: urlFilters.minPrice,
    maxPrice: urlFilters.maxPrice,
  };

  const cursor = urlFilters.cursor;

  // Build query params from filters
  const queryParams: GetOrdersQuery = {
    cursor,
    limit,
    customerId: filters.customerId,
    status: filters.status,
    // API only supports 'createdAt' and 'total' for sortBy
    sortBy: filters.sortBy === 'price-asc' || filters.sortBy === 'price-desc'
      ? 'total'
      : 'createdAt',
    sortOrder: filters.sortBy?.includes('desc') || filters.sortBy === 'oldest' ? 'desc' : 'asc',
  };

  // Fetch orders with React Query
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', queryParams, accessToken],
    queryFn: () => ordersAPI.getOrders(queryParams, accessToken!),
    enabled: !!accessToken,
    retry: 1,
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (formData: OrderFormData) => {
      const createData = {
        customerId: formData.customerId,
        items: formData.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: formData.shippingAddress,
        shippingFee: 0,
        note: formData.note,
      };
      return ordersAPI.createOrder(createData, accessToken!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsModalOpen(false);
      showSuccessAlert('Order Created!', 'New order has been added successfully');
    },
    onError: (error: any) => {
      showErrorAlert('Create Failed', error.message || 'Failed to create order');
    },
  });

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => {
      return ordersAPI.updateOrder(id, data, accessToken!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setIsModalOpen(false);
      setEditingOrder(null);
      showSuccessAlert('Order Updated!', 'Order has been updated successfully');
    },
    onError: (error: any) => {
      showErrorAlert('Update Failed', error.message || 'Failed to update order');
    },
  });

  // Delete order mutation
  const deleteOrderMutation = useMutation({
    mutationFn: (id: string) => ordersAPI.deleteOrder(id, accessToken!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      showSuccessAlert('Order Deleted!', 'Order has been deleted successfully');
    },
    onError: (error: any) => {
      showErrorAlert('Delete Failed', error.message || 'Failed to delete order');
    },
  });

  const handleCreateOrder = (formData: OrderFormData) => {
    createOrderMutation.mutate(formData);
  };

  const handleEditOrder = (order: APIOrder) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateOrder = (formData: OrderFormData) => {
    if (editingOrder) {
      // Note: Backend doesn't allow updating items after order creation
      const updateData = {
        shippingAddress: formData.shippingAddress,
        note: formData.note,
        status: formData.status,
      };
      updateOrderMutation.mutate({ id: editingOrder.id, data: updateData });
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
      deleteOrderMutation.mutate(orderId);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleLoadMore = () => {
    if (data?.pagination.nextCursor) {
      setUrlFilters((prev) => ({ ...prev, cursor: data.pagination.nextCursor || undefined }));
    }
  };

  // Handler to update filters (syncs with URL)
  const handleFiltersChange = (newFilters: OrderFilters) => {
    setUrlFilters({
      sortBy: newFilters.sortBy,
      status: newFilters.status,
      customerId: newFilters.customerId,
      minPrice: newFilters.minPrice,
      maxPrice: newFilters.maxPrice,
      cursor: undefined, // Reset cursor when filters change
    });
  };

  // Convert API orders to display format
  const orders = data?.data || [];
  const pagination = data?.pagination;
  const hasMore = pagination?.hasMore || false;

  // Apply client-side filters (price range and status)
  let filteredOrders = orders.filter(order => {
    if (filters.minPrice !== undefined && order.total < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice !== undefined && order.total > filters.maxPrice) {
      return false;
    }
    return true;
  });

  // Apply client-side sorting
  if (filters.sortBy === 'customer-asc') {
    filteredOrders = [...filteredOrders].sort((a, b) => a.customerId.localeCompare(b.customerId));
  } else if (filters.sortBy === 'customer-desc') {
    filteredOrders = [...filteredOrders].sort((a, b) => b.customerId.localeCompare(a.customerId));
  } else if (filters.sortBy === 'id-asc') {
    filteredOrders = [...filteredOrders].sort((a, b) => a.id.localeCompare(b.id));
  } else if (filters.sortBy === 'id-desc') {
    filteredOrders = [...filteredOrders].sort((a, b) => b.id.localeCompare(a.id));
  }

  // Show loading state on initial load
  if (!user || !accessToken) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Order Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your orders with ease. Total: {pagination?.total || 0} orders
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
      <OrderFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading orders</h3>
              <p className="text-sm text-red-700 mt-1">{(error as any)?.message || 'Failed to load orders'}</p>
              <button 
                onClick={() => refetch()}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="animate-spin mx-auto h-12 w-12 text-blue-600"
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
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredOrders.length === 0 && (
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
        )}

        {/* Table */}
        {!isLoading && filteredOrders.length > 0 && (
          <>
            <OrderTable
              orders={filteredOrders as any}
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
                    `Load More (${filteredOrders.length} of ${pagination?.total || 0})`
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
          order={editingOrder as any}
        />
    </div>
  );
}
