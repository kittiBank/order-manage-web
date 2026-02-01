import { Order } from '@/app/types/order';

export const mockOrders: Order[] = [
  {
    id: '1',
    customerId: 'CUST001',
    items: [
      { productId: 'PROD001', productName: 'Laptop Pro 15"', quantity: 2, price: 45900 },
      { productId: 'PROD002', productName: 'Wireless Mouse', quantity: 1, price: 890 }
    ],
    shippingAddress: {
      name: 'John Doe',
      phone: '0812345678',
      address: '123 Main Street, Sukhumvit 21',
      province: 'Bangkok',
      postalCode: '10110'
    },
    note: 'Please deliver before 5 PM',
    status: 'DELIVERED',
    createdAt: '2026-01-28T10:30:00Z',
    updatedAt: '2026-01-28T15:30:00Z',
    subtotal: 92690,
    shippingFee: 100,
    total: 92790,
    totalAmount: 92690
  },
  {
    id: '2',
    customerId: 'CUST002',
    items: [
      { productId: 'PROD003', productName: 'Office Chair Ergonomic', quantity: 5, price: 8500 }
    ],
    shippingAddress: {
      name: 'Jane Smith',
      phone: '0898765432',
      address: '456 Business Center, Sathorn Road',
      province: 'Bangkok',
      postalCode: '10120'
    },
    note: 'Corporate order - Invoice required',
    status: 'PROCESSING',
    createdAt: '2026-01-29T14:20:00Z',
    updatedAt: '2026-01-29T16:20:00Z',
    subtotal: 42500,
    shippingFee: 150,
    total: 42650,
    totalAmount: 42500
  },
  {
    id: '3',
    customerId: 'CUST003',
    items: [
      { productId: 'PROD002', productName: 'Wireless Mouse', quantity: 10, price: 890 }
    ],
    shippingAddress: {
      name: 'Bob Wilson',
      phone: '0823456789',
      address: '789 Tech Park, Rama 4 Road',
      province: 'Bangkok',
      postalCode: '10500'
    },
    status: 'PENDING',
    createdAt: '2026-01-30T09:15:00Z',
    updatedAt: '2026-01-30T09:15:00Z',
    subtotal: 8900,
    shippingFee: 50,
    total: 8950,
    totalAmount: 8900
  },
  {
    id: '4',
    customerId: 'CUST004',
    items: [
      { productId: 'PROD004', productName: 'Desk Lamp LED', quantity: 3, price: 1200 }
    ],
    shippingAddress: {
      name: 'Alice Brown',
      phone: '0834567890',
      address: '321 Home Plaza, Petchaburi Road',
      province: 'Bangkok',
      postalCode: '10400'
    },
    note: 'Gift wrapping requested',
    status: 'DELIVERED',
    createdAt: '2026-01-31T16:45:00Z',
    updatedAt: '2026-01-31T20:45:00Z',
    subtotal: 3600,
    shippingFee: 50,
    total: 3650,
    totalAmount: 3600
  },
  {
    id: '5',
    customerId: 'CUST005',
    items: [
      { productId: 'PROD005', productName: 'USB-C Cable 2m', quantity: 15, price: 350 }
    ],
    shippingAddress: {
      name: 'Charlie Davis',
      phone: '0845678901',
      address: '555 Shopping Mall, Siam Square',
      province: 'Bangkok',
      postalCode: '10330'
    },
    status: 'PENDING',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-01T08:00:00Z',
    subtotal: 5250,
    shippingFee: 50,
    total: 5300,
    totalAmount: 5250
  }
];

export const mockProducts = [
  { id: 'PROD001', name: 'Laptop Pro 15"', price: 45900 },
  { id: 'PROD002', name: 'Wireless Mouse', price: 890 },
  { id: 'PROD003', name: 'Office Chair Ergonomic', price: 8500 },
  { id: 'PROD004', name: 'Desk Lamp LED', price: 1200 },
  { id: 'PROD005', name: 'USB-C Cable 2m', price: 350 },
  { id: 'PROD006', name: 'Mechanical Keyboard', price: 3500 },
  { id: 'PROD007', name: 'Monitor 27"', price: 12900 },
  { id: 'PROD008', name: 'Webcam HD', price: 2500 },
];
