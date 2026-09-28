import { productById, products } from "./catalog";
import type { Product } from "./types";

const KEYWORDS: { keys: string[]; ids: string[] }[] = [
  { keys: ["plant", "water", "irrigat", "soil", "garden", "agri"], ids: ["esp32-dev", "soil", "pump-12", "relay-1", "adapter-12", "jumper-40"] },
  { keys: ["rover", "autonomous", "6wd"], ids: ["esp32-dev", "chassis-6wd", "gear-motor", "l298n", "hc-sr04", "imu-6050", "battery-12", "buck-12-5", "jumper-40"] },
  { keys: ["obstacle", "avoid", "ultrasonic"], ids: ["esp32-dev", "gear-motor", "l298n", "hc-sr04", "battery-12", "jumper-40"] },
  { keys: ["weather", "dht", "temp"], ids: ["esp32-dev", "dht22", "oled-128", "jumper-40"] },
  { keys: ["vision", "camera", "detect", "ai"], ids: ["esp32-dev", "ai-cam", "oled-128", "jumper-40"] },
  { keys: ["wifi", "robot"], ids: ["esp32-dev", "gear-motor", "l298n", "battery-12", "jumper-40"] },
];

function budgetFromPrompt(prompt: string) {
  const m = prompt.replace(/,/g, "").match(/₹?\s*(\d{3,6})/);
  return m ? Number(m[1]) : 5000;
}

export function buildFromPrompt(prompt: string) {
  const lower = prompt.toLowerCase();
  const hit = KEYWORDS.find((row) => row.keys.some((k) => lower.includes(k))) ?? KEYWORDS[0];
  const budget = budgetFromPrompt(prompt);
  let lines = hit.ids
    .map((id) => productById(id))
    .filter((p): p is Product => Boolean(p))
    .map((p) => ({ product: p, quantity: p.id === "gear-motor" && lower.includes("rover") ? 6 : 1 }));

  let total = lines.reduce((n, l) => n + l.product.price * l.quantity, 0);
  if (total > budget) {
    lines = lines.filter((l) => l.product.id !== "chassis-6wd");
    total = lines.reduce((n, l) => n + l.product.price * l.quantity, 0);
  }

  const title =
    lower.includes("plant") || lower.includes("water")
      ? "Automatic Plant Watering"
      : lower.includes("rover")
        ? "Autonomous Rover"
        : lower.includes("weather")
          ? "Weather Station"
          : lower.includes("vision") || lower.includes("detect")
            ? "AI Object Detection"
            : "Custom Maker Build";

  return { title, budget, lines, total, withinBudget: total <= budget };
}

export function suggestionsFor(productIds: string[]) {
  const scores = new Map<string, number>();
  for (const id of productIds) {
    const p = productById(id);
    p?.alsoNeed.forEach((other) => {
      if (!productIds.includes(other)) scores.set(other, (scores.get(other) ?? 0) + 2);
    });
  }
  products.forEach((p) => {
    if (productIds.includes(p.id)) return;
    if (p.alsoNeed.some((id) => productIds.includes(id))) {
      scores.set(p.id, (scores.get(p.id) ?? 0) + 1);
    }
  });
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id]) => productById(id))
    .filter((p): p is Product => Boolean(p));
}
