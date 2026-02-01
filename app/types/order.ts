export interface OrderItem {
  productId: string;
  productName?: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  province: string;
  postalCode: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingFee: number;
  total: number;
  note?: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  totalAmount?: number; // Computed field for compatibility
}

export interface OrderFormData {
  customerId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  note?: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

export interface OrderFilters {
  customerId?: string;
  status?: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'customer-asc' | 'customer-desc' | 'newest' | 'oldest' | 'id-asc' | 'id-desc';
}
