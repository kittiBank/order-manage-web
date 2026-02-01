import { NextRequest, NextResponse } from "next/server";
import { mockOrders } from "@/lib/mockOrders";

// GET /api/v1/orders - Get list of orders with filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10");
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Filter orders
    let filteredOrders = [...mockOrders];

    if (customerId) {
      filteredOrders = filteredOrders.filter(
        (order) => order.customerId === customerId,
      );
    }

    if (status) {
      filteredOrders = filteredOrders.filter(
        (order) => order.status === status,
      );
    }

    // Sort orders
    filteredOrders.sort((a, b) => {
      const aValue =
        sortBy === "createdAt" ? new Date(a.createdAt).getTime() : a.total;
      const bValue =
        sortBy === "createdAt" ? new Date(b.createdAt).getTime() : b.total;
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });

    // Find cursor position
    let startIndex = 0;
    if (cursor) {
      const cursorIndex = filteredOrders.findIndex(
        (order) => order.id === cursor,
      );
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1;
      }
    }

    // Paginate
    const paginatedOrders = filteredOrders.slice(
      startIndex,
      startIndex + limit,
    );
    const hasMore = startIndex + limit < filteredOrders.length;
    const nextCursor = hasMore
      ? paginatedOrders[paginatedOrders.length - 1]?.id
      : null;

    return NextResponse.json({
      data: paginatedOrders,
      pagination: {
        nextCursor,
        prevCursor: null,
        hasMore,
        total: filteredOrders.length,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}

// POST /api/v1/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.customerId ||
      !body.items ||
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        { message: "Invalid request: customerId and items are required" },
        { status: 400 },
      );
    }

    if (!body.shippingAddress) {
      return NextResponse.json(
        { message: "Invalid request: shippingAddress is required" },
        { status: 400 },
      );
    }

    // Calculate totals
    const subtotal = body.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );
    const shippingFee = body.shippingFee || 0;
    const total = subtotal + shippingFee;

    // Create new order
    const newOrder = {
      id: `ORD-${Date.now()}`,
      customerId: body.customerId,
      items: body.items,
      subtotal,
      shippingFee,
      total,
      totalAmount: subtotal, // Add totalAmount field for compatibility
      status: "PENDING" as const,
      shippingAddress: body.shippingAddress,
      note: body.note || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real app, save to database
    mockOrders.push(newOrder);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Failed to create order" },
      { status: 500 },
    );
  }
}
