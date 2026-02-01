'use client';

import React, { useState, useEffect } from 'react';
import { Order, OrderFormData, OrderItem } from '@/app/types/order';
import { mockProducts } from '@/lib/mockOrders';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: OrderFormData) => void;
  order?: Order | null;
}

export default function OrderModal({ isOpen, onClose, onSave, order }: OrderModalProps) {
  const [formData, setFormData] = useState<OrderFormData>({
    customerId: '',
    items: [{ productId: '', productName: '', quantity: 1, price: 0 }],
    shippingAddress: {
      name: '',
      phone: '',
      address: '',
      province: '',
      postalCode: ''
    },
    note: '',
    status: 'PENDING',
  });

  useEffect(() => {
    if (order) {
      setFormData({
        customerId: order.customerId,
        items: order.items,
        shippingAddress: order.shippingAddress,
        note: order.note || '',
        status: order.status,
      });
    } else {
      setFormData({
        customerId: '',
        items: [{ productId: '', productName: '', quantity: 1, price: 0 }],
        shippingAddress: {
          name: '',
          phone: '',
          address: '',
          province: '',
          postalCode: ''
        },
        note: '',
        status: 'PENDING',
      });
    }
  }, [order, isOpen]);

  const handleProductChange = (index: number, productId: string) => {
    const selectedProduct = mockProducts.find(p => p.id === productId);
    if (selectedProduct) {
      const newItems = [...formData.items];
      newItems[index] = {
        ...newItems[index],
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        price: selectedProduct.price
      };
      setFormData({ ...formData, items: newItems });
    }
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', productName: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData({ ...formData, items: newItems });
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 z-10">
          <h2 className="text-xl font-semibold text-gray-900">
            {order ? 'Edit Order' : 'Create New Order'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer ID *
            </label>
            <input
              type="text"
              required
              value={formData.customerId}
              onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., CUST001"
            />
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Order Items *
              </label>
              <button
                type="button"
                onClick={addItem}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Item
              </button>
            </div>

            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Product Selection */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Product
                        </label>
                        <select
                          required
                          value={item.productId}
                          onChange={(e) => handleProductChange(index, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        >
                          <option value="">Select Product</option>
                          {mockProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} (฿{product.price.toLocaleString()})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        />
                      </div>

                      {/* Price */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Unit Price (฿)
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100 text-gray-900"
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Remove Button */}
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="mt-6 text-red-600 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Subtotal */}
                  <div className="mt-2 text-right text-sm text-gray-600">
                    Subtotal: <span className="font-semibold text-blue-600">
                      ฿{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Amount */}
            <div className="mt-3 p-3 bg-blue-50 rounded-lg flex justify-between items-center">
              <span className="font-medium text-gray-700">Total Amount:</span>
              <span className="text-xl font-bold text-blue-600">
                ฿{calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border-t pt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shippingAddress.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, name: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.shippingAddress.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, phone: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="0812345678"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Address *
                </label>
                <textarea
                  required
                  value={formData.shippingAddress.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, address: e.target.value }
                  })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Street address, building, floor"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Province *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shippingAddress.province}
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, province: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Bangkok"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shippingAddress.postalCode}
                  onChange={(e) => setFormData({
                    ...formData,
                    shippingAddress: { ...formData.shippingAddress, postalCode: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="10110"
                />
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (Optional)
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Additional notes or instructions"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {order ? 'Update' : 'Create'} Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
