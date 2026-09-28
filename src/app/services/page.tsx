"use client";

import { FormEvent, useMemo, useState } from "react";

function estimatePrint(material: string, qty: number, size: number) {
  const base = material === "ABS" ? 18 : material === "PETG" ? 14 : 10;
  return Math.max(199, Math.round(base * size * qty));
}

export default function ServicesPage() {
  const [pcb, setPcb] = useState({ qty: 10, layers: 2, w: 100, h: 80 });
  const pcbQuote = useMemo(() => {
    const area = (pcb.w * pcb.h) / 10000;
    return Math.round((180 + area * 420 * pcb.layers) * pcb.qty);
  }, [pcb]);

  const [print, setPrint] = useState({ material: "PLA", qty: 5, size: 80 });
  const printQuote = estimatePrint(print.material, print.qty, print.size / 20);

  const [msg, setMsg] = useState("");

  const submit = async (kind: "pcb" | "print" | "prototype", payload: Record<string, string>) => {
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, payload }),
    });
    const data = await res.json();
    setMsg(`Quote ${data.quote.id} saved. We will email a formal number from admin.`);
  };

  const proto = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    void submit("prototype", {
      idea: String(form.get("idea")),
      budget: String(form.get("budget")),
      timeline: String(form.get("timeline")),
    });
  };

  return (
    <div className="space-y-10">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-[#d6ff4b]">Engineering services</p>
        <h1 className="font-[family-name:var(--font-serif)] text-4xl italic">PCB, print, prototype</h1>
        <p className="mt-2 text-[#b7b2a4]">B2B-friendly quotes. File upload to Supabase Storage is the next hook.</p>
      </div>
      {msg && <p className="rounded-xl border border-[#d6ff4b]/40 bg-[#161911] p-3 text-sm">{msg}</p>}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="panel p-6">
          <h2 className="text-2xl">PCB</h2>
          <p className="mt-1 text-sm text-[#8d897c]">Upload Gerber (placeholder input)</p>
          <input type="file" className="mt-3 text-sm" />
          <label className="mt-4 block text-sm">
            Quantity
            <input
              type="number"
              value={pcb.qty}
              onChange={(e) => setPcb({ ...pcb, qty: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-[#23251f] bg-transparent px-2 py-1"
            />
          </label>
          <label className="mt-3 block text-sm">
            Layers
            <input
              type="number"
              value={pcb.layers}
              onChange={(e) => setPcb({ ...pcb, layers: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-[#23251f] bg-transparent px-2 py-1"
            />
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <label>
              Width mm
              <input
                type="number"
                value={pcb.w}
                onChange={(e) => setPcb({ ...pcb, w: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-[#23251f] bg-transparent px-2 py-1"
              />
            </label>
            <label>
              Height mm
              <input
                type="number"
                value={pcb.h}
                onChange={(e) => setPcb({ ...pcb, h: Number(e.target.value) })}
                className="mt-1 w-full rounded-lg border border-[#23251f] bg-transparent px-2 py-1"
              />
            </label>
          </div>
          <p className="mt-4 text-2xl">₹{pcbQuote.toLocaleString("en-IN")}</p>
          <button
            className="btn-acid mt-4"
            onClick={() =>
              submit("pcb", {
                qty: String(pcb.qty),
                layers: String(pcb.layers),
                size: `${pcb.w}x${pcb.h}`,
                estimate: String(pcbQuote),
              })
            }
          >
            Get quote
          </button>
        </section>

        <section className="panel p-6">
          <h2 className="text-2xl">3D print</h2>
          <input type="file" accept=".stl" className="mt-3 text-sm" />
          <label className="mt-4 block text-sm">
            Material
            <select
              value={print.material}
              onChange={(e) => setPrint({ ...print, material: e.target.value })}
              className="mt-1 w-full rounded-lg border border-[#23251f] bg-[#0c0e0a] px-2 py-1"
            >
              <option>PLA</option>
              <option>PETG</option>
              <option>ABS</option>
            </select>
          </label>
          <label className="mt-3 block text-sm">
            Quantity
            <input
              type="number"
              value={print.qty}
              onChange={(e) => setPrint({ ...print, qty: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-[#23251f] bg-transparent px-2 py-1"
            />
          </label>
          <p className="mt-4 text-2xl">₹{printQuote.toLocaleString("en-IN")}</p>
          <button
            className="btn-acid mt-4"
            onClick={() =>
              submit("print", { material: print.material, qty: String(print.qty), estimate: String(printQuote) })
            }
          >
            Order
          </button>
        </section>

        <form className="panel p-6" onSubmit={proto}>
          <h2 className="text-2xl">Custom prototype</h2>
          <p className="mt-1 text-sm text-[#8d897c]">I have an idea.</p>
          <textarea name="idea" required rows={4} className="mt-3 w-full rounded-xl border border-[#23251f] bg-transparent p-2" />
          <input name="budget" placeholder="Budget ₹" className="mt-3 w-full rounded-xl border border-[#23251f] bg-transparent px-2 py-2" />
          <input name="timeline" placeholder="Timeline" className="mt-3 w-full rounded-xl border border-[#23251f] bg-transparent px-2 py-2" />
          <input type="file" className="mt-3 text-sm" />
          <button className="btn-acid mt-4">Request quote</button>
        </form>
      </div>
    </div>
  );
}
