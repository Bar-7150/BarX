import { NextRequest, NextResponse } from "next/server";
import { productById } from "@/lib/catalog";
import { getOrder, listOrders, nextId, ordersForEmail, saveOrder, updateOrderStatus } from "@/lib/store";
import type { CartItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const items = (body.items as CartItem[]) ?? [];
  if (!body.email || !body.name || items.length === 0) {
    return NextResponse.json({ error: "Name, email and items are required." }, { status: 400 });
  }

  const lines = items
    .map((i) => {
      const p = productById(i.productId);
      if (!p) return null;
      return { productId: p.id, name: p.name, quantity: i.quantity, price: p.price };
    })
    .filter(Boolean);

  if (lines.length === 0) {
    return NextResponse.json({ error: "Unknown products." }, { status: 400 });
  }

  const total = lines.reduce((n, l) => n + l!.price * l!.quantity, 0);
  const order = await saveOrder({
    id: nextId("KR"),
    createdAt: new Date().toISOString(),
    email: body.email,
    name: body.name,
    phone: body.phone ?? "",
    address: body.address ?? "",
    city: body.city ?? "",
    pincode: body.pincode ?? "",
    items: lines as { productId: string; name: string; quantity: number; price: number }[],
    total,
    status: "confirmed",
  });

  return NextResponse.json({ order });
}

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get("email");
  const id = req.nextUrl.searchParams.get("id");
  const admin = req.nextUrl.searchParams.get("admin");
  if (id) {
    const order = await getOrder(id);
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ order });
  }
  if (admin === "1") {
    return NextResponse.json({ orders: await listOrders() });
  }
  if (!email) return NextResponse.json({ orders: [] });
  return NextResponse.json({ orders: await ordersForEmail(email) });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }
  await updateOrderStatus(body.id, body.status);
  return NextResponse.json({ ok: true });
}
