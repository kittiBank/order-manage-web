import { API_URL, API_ENDPOINTS } from './config';

// Types matching backend DTOs
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  productName?: string; // Added for display
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
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: ShippingAddress;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  customerId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingFee?: number;
  note?: string;
}

export interface UpdateOrderRequest {
  items?: OrderItem[];
  shippingAddress?: ShippingAddress;
  shippingFee?: number;
  note?: string;
  status?: Order['status'];
}

export interface GetOrdersQuery {
  cursor?: string;
  limit?: number;
  customerId?: string;
  status?: Order['status'];
  sortBy?: 'createdAt' | 'total';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
    total: number;
  };
}

export const ordersAPI = {
  /**
   * Get list of orders with filters and pagination
   */
  async getOrders(
    query: GetOrdersQuery,
    accessToken: string
  ): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    
    if (query.cursor) params.append('cursor', query.cursor);
    if (query.limit) params.append('limit', query.limit.toString());
    if (query.customerId) params.append('customerId', query.customerId);
    if (query.status) params.append('status', query.status);
    if (query.sortBy) params.append('sortBy', query.sortBy);
    if (query.sortOrder) params.append('sortOrder', query.sortOrder);

    const response = await fetch(
      `${API_URL}${API_ENDPOINTS.ORDERS.LIST}?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch orders' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Get single order by ID
   */
  async getOrder(id: string, accessToken: string): Promise<Order> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.ORDERS.GET(id)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch order' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Create new order
   */
  async createOrder(
    data: CreateOrderRequest,
    accessToken: string
  ): Promise<Order> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.ORDERS.CREATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create order' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Update order
   */
  async updateOrder(
    id: string,
    data: UpdateOrderRequest,
    accessToken: string
  ): Promise<Order> {
    console.log('=== Update Order Request ===');
    console.log('ID:', id);
    console.log('Data:', JSON.stringify(data, null, 2));
    console.log('Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'NO TOKEN');
    console.log('URL:', `${API_URL}${API_ENDPOINTS.ORDERS.UPDATE(id)}`);
    
    const response = await fetch(`${API_URL}${API_ENDPOINTS.ORDERS.UPDATE(id)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update order' }));
      console.error('Error response:', error);
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Delete order (soft delete)
   */
  async deleteOrder(id: string, accessToken: string): Promise<void> {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.ORDERS.DELETE(id)}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to delete order' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
  },
};
