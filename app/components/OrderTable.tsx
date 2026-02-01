'use client';

import React from 'react';
import { Order } from '@/app/types/order';

interface OrderTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
}

export default function OrderTable({ orders, onEdit, onDelete }: OrderTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status];
  };

  const calculateTotal = (order: Order) => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
              Shipping To
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
              Total Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-blue-900 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-blue-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">#{order.id}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{order.customerId}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  <div className="text-xs text-gray-500 mt-1">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx}>
                        {item.productName} x{item.quantity}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div className="text-blue-600">+{order.items.length - 2} more</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{order.shippingAddress.name}</div>
                <div className="text-xs text-gray-500">{order.shippingAddress.phone}</div>
                <div className="text-xs text-gray-500">{order.shippingAddress.province}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900">
                  {formatPrice(calculateTotal(order))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(order)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(order.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
