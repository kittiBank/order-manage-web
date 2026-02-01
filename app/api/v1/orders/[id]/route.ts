import { NextRequest, NextResponse } from 'next/server';
import { mockOrders } from '@/lib/mockOrders';

// GET /api/v1/orders/:id - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = mockOrders.find(o => o.id === params.id);
    
    if (!order) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { message: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/orders/:id - Update order
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const orderIndex = mockOrders.findIndex(o => o.id === params.id);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    const existingOrder = mockOrders[orderIndex];

    // Update order fields
    const updatedOrder = {
      ...existingOrder,
      ...(body.items && { items: body.items }),
      ...(body.shippingAddress && { shippingAddress: body.shippingAddress }),
      ...(body.status && { status: body.status }),
      ...(body.note !== undefined && { note: body.note }),
      updatedAt: new Date().toISOString(),
    };

    // Recalculate totals if items changed
    if (body.items) {
      updatedOrder.subtotal = body.items.reduce((sum: number, item: any) => 
        sum + (item.price * item.quantity), 0
      );
      updatedOrder.shippingFee = body.shippingFee !== undefined ? body.shippingFee : existingOrder.shippingFee;
      updatedOrder.total = updatedOrder.subtotal + updatedOrder.shippingFee;
    }

    // Update in mock array
    mockOrders[orderIndex] = updatedOrder;

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { message: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/orders/:id - Delete order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderIndex = mockOrders.findIndex(o => o.id === params.id);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    // Remove order from array (soft delete in real app)
    mockOrders.splice(orderIndex, 1);

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { message: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
