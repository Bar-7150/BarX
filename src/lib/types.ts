export type Compatibility = "Arduino IDE" | "PlatformIO" | "MicroPython" | "Raspberry Pi OS" | "ROS" | "CircuitPython";

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type OrderStatus =
  | "confirmed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type Category = {
  slug: string;
  name: string;
  parent?: string;
  blurb: string;
};

export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  rating: number;
  reviews: number;
  short: string;
  description: string;
  specs: Record<string, string>;
  compatibleWith: Compatibility[];
  documents: { label: string; href: string }[];
  alsoNeed: string[];
  warehouse: string;
  featured?: boolean;
  isKit?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  emoji: string;
  author: string;
  difficulty: Difficulty;
  cost: number;
  buildTime: string;
  views: number;
  rating: number;
  category: "robot" | "iot" | "ai" | "drone" | "agriculture";
  summary: string;
  components: { productId: string; quantity: number }[];
  kitProductId?: string;
  studentTrack?: "mini" | "major" | "final-year";
  steps: string[];
};

export type Lesson = {
  slug: string;
  topic: string;
  title: string;
  minutes: number;
  body: string;
  projectSlug?: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Order = {
  id: string;
  createdAt: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: { productId: string; name: string; quantity: number; price: number }[];
  total: number;
  status: OrderStatus;
};

export type QuoteRequest = {
  id: string;
  kind: "pcb" | "print" | "prototype";
  createdAt: string;
  payload: Record<string, string>;
};
