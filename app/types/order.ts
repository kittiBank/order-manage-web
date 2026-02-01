export interface Order {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  description?: string;
}

export interface OrderFormData {
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  description?: string;
}

export interface OrderFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';
}
