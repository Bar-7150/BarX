import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { Order, QuoteRequest } from "./types";

const dir = path.join(process.cwd(), "data");
const ordersFile = path.join(dir, "orders.json");
const quotesFile = path.join(dir, "quotes.json");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, value: unknown) {
  await mkdir(dir, { recursive: true });
  await writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

export async function listOrders(): Promise<Order[]> {
  return readJson<Order[]>(ordersFile, []);
}

export async function getOrder(id: string) {
  const all = await listOrders();
  return all.find((o) => o.id === id);
}

export async function saveOrder(order: Order) {
  const all = await listOrders();
  all.unshift(order);
  await writeJson(ordersFile, all);
  return order;
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const all = await listOrders();
  const next = all.map((o) => (o.id === id ? { ...o, status } : o));
  await writeJson(ordersFile, next);
}

export async function ordersForEmail(email: string) {
  const all = await listOrders();
  return all.filter((o) => o.email.toLowerCase() === email.toLowerCase());
}

export async function listQuotes(): Promise<QuoteRequest[]> {
  return readJson<QuoteRequest[]>(quotesFile, []);
}

export async function saveQuote(quote: QuoteRequest) {
  const all = await listQuotes();
  all.unshift(quote);
  await writeJson(quotesFile, all);
  return quote;
}

export function nextId(prefix: string) {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}${n}`;
}
