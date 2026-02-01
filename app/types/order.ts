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
  note?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  totalAmount?: number;
}

export interface OrderFormData {
  customerId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  note?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

export interface OrderFilters {
  customerId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'customer-asc' | 'customer-desc' | 'newest';
}
