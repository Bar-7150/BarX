import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SimulationState } from "./simulation";
import { createSimulationState } from "./simulation";

export type Pin = { id: string; label: string; side: "top" | "right" | "bottom" | "left"; offset: number };
export type ComponentType = "board" | "led" | "resistor" | "button" | "battery" | "sensor";
export type CircuitComponent = {
  id: string;
  type: ComponentType;
  name: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
  properties: Record<string, string>;
  pins: Pin[];
};
export type Connection = {
  id: string;
  from: { componentId: string; pinId: string };
  to: { componentId: string; pinId: string };
};
export type CircuitProject = {
  name: string;
  board: "arduino-uno";
  components: CircuitComponent[];
  connections: Connection[];
  code: string;
  settings: { gridSize: number; zoom: number };
};

type HistoryEntry = Pick<CircuitProject, "components" | "connections">;
type CircuitStore = CircuitProject & {
  selectedId: string | null;
  selectedPin: { componentId: string; pinId: string } | null;
  simulation: SimulationState;
  lastSavedAt: string | null;
  past: HistoryEntry[];
  future: HistoryEntry[];
  setCode: (code: string) => void;
  addComponent: (component: CircuitComponent) => void;
  updateComponent: (id: string, update: Partial<CircuitComponent>) => void;
  removeComponent: (id: string) => void;
  connectPins: (from: { componentId: string; pinId: string }, to: { componentId: string; pinId: string }) => void;
  removeConnection: (id: string) => void;
  select: (id: string | null) => void;
  selectPin: (pin: { componentId: string; pinId: string } | null) => void;
  setSimulation: (simulation: SimulationState) => void;
  markSaved: () => void;
  undo: () => void;
  redo: () => void;
};

const defaultCode = `void setup() {
  pinMode(13, OUTPUT);
}

void loop() {
  digitalWrite(13, HIGH);
  delay(1000);
  digitalWrite(13, LOW);
  delay(1000);
}`;

const initialProject: CircuitProject = {
  name: "LED Blink",
  board: "arduino-uno",
  components: [
    {
      id: "arduino-1",
      type: "board",
      name: "Arduino Uno",
      x: 330,
      y: 190,
      rotation: 0,
      color: "#238a91",
      properties: {},
      pins: [
        { id: "5v", label: "5V", side: "left", offset: 28 },
        { id: "gnd", label: "GND", side: "left", offset: 78 },
        { id: "d13", label: "D13", side: "right", offset: 44 },
        { id: "d2", label: "D2", side: "right", offset: 78 },
      ],
    },
  ],
  connections: [],
  code: defaultCode,
  settings: { gridSize: 20, zoom: 1 },
};

function snapshot(state: CircuitStore): HistoryEntry {
  return { components: state.components, connections: state.connections };
}

function withHistory(state: CircuitStore): Pick<CircuitStore, "past" | "future"> {
  return { past: [...state.past, snapshot(state)].slice(-40), future: [] };
}

export const useCircuitStore = create<CircuitStore>()(
  persist(
    (set) => ({
      ...initialProject,
      selectedId: null,
      selectedPin: null,
      simulation: createSimulationState(),
      lastSavedAt: null,
      past: [],
      future: [],
      setCode: (code) => set({ code }),
      addComponent: (component) => set((state) => ({ ...withHistory(state), components: [...state.components, component], selectedId: component.id })),
      updateComponent: (id, update) => set((state) => ({ ...withHistory(state), components: state.components.map((component) => component.id === id ? { ...component, ...update } : component) })),
      removeComponent: (id) => set((state) => ({
        ...withHistory(state),
        components: state.components.filter((component) => component.id !== id),
        connections: state.connections.filter((connection) => connection.from.componentId !== id && connection.to.componentId !== id),
        selectedId: null,
      })),
      connectPins: (from, to) => set((state) => ({
        ...withHistory(state),
        connections: [...state.connections.filter((connection) => ![connection.from, connection.to].some((pin) => pin.componentId === from.componentId && pin.pinId === from.pinId)), { id: `${from.componentId}-${from.pinId}-${to.componentId}-${to.pinId}`, from, to }],
        selectedPin: null,
      })),
      removeConnection: (id) => set((state) => ({ ...withHistory(state), connections: state.connections.filter((connection) => connection.id !== id) })),
      select: (selectedId) => set({ selectedId }),
      selectPin: (selectedPin) => set({ selectedPin }),
      setSimulation: (simulation) => set({ simulation }),
      markSaved: () => set({ lastSavedAt: new Date().toISOString() }),
      undo: () => set((state) => {
        const previous = state.past.at(-1);
        if (!previous) return state;
        return { ...previous, past: state.past.slice(0, -1), future: [snapshot(state), ...state.future].slice(0, 40) };
      }),
      redo: () => set((state) => {
        const next = state.future[0];
        if (!next) return state;
        return { ...next, past: [...state.past, snapshot(state)].slice(-40), future: state.future.slice(1) };
      }),
    }),
    { name: "barx-circuit-project" },
  ),
);

export { defaultCode };
