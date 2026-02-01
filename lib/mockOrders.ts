import { Order } from '@/app/types/order';

export const mockOrders: Order[] = [
  {
    id: '1',
    name: 'Laptop Pro 15"',
    category: 'Electronics',
    price: 45900,
    quantity: 2,
    status: 'completed',
    createdAt: '2026-01-28T10:30:00Z',
    description: 'High-performance laptop with 16GB RAM and 512GB SSD'
  },
  {
    id: '2',
    name: 'Office Chair Ergonomic',
    category: 'Furniture',
    price: 8500,
    quantity: 5,
    status: 'processing',
    createdAt: '2026-01-29T14:20:00Z',
    description: 'Ergonomic office chair with lumbar support'
  },
  {
    id: '3',
    name: 'Wireless Mouse',
    category: 'Electronics',
    price: 890,
    quantity: 10,
    status: 'pending',
    createdAt: '2026-01-30T09:15:00Z',
    description: 'Bluetooth wireless mouse with rechargeable battery'
  },
  {
    id: '4',
    name: 'Desk Lamp LED',
    category: 'Furniture',
    price: 1200,
    quantity: 3,
    status: 'completed',
    createdAt: '2026-01-31T16:45:00Z',
    description: 'Adjustable LED desk lamp with touch control'
  },
  {
    id: '5',
    name: 'USB-C Cable 2m',
    category: 'Accessories',
    price: 350,
    quantity: 15,
    status: 'pending',
    createdAt: '2026-02-01T08:00:00Z',
    description: 'Fast charging USB-C cable with braided design'
  }
];

export const categories = ['Electronics', 'Furniture', 'Accessories'];
