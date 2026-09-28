export type DigitalValue = "LOW" | "HIGH";

export type SimulationEvent = {
  id: string;
  message: string;
  timestamp: string;
};

export type SimulationState = {
  running: boolean;
  gpio: Record<string, DigitalValue>;
  ledOn: boolean;
  events: SimulationEvent[];
  sequence: Array<{ pin: string; value: DigitalValue }>;
  stepIndex: number;
};

const blinkCode = /digitalWrite\(\s*(\d+)\s*,\s*(HIGH|LOW)\s*\)/g;

export function createSimulationState(): SimulationState {
  return { running: false, gpio: {}, ledOn: false, events: [], sequence: [], stepIndex: 0 };
}

export function simulateArduinoCode(code: string, connectedPins: string[]): SimulationState {
  const matches = [...code.matchAll(blinkCode)];
  const normalizedPins = connectedPins.map((value) => value.toUpperCase());
  const pin = normalizedPins.find((value) => value === "D13") ?? "D13";
  const gpio: Record<string, DigitalValue> = {};
  const sequence = matches.slice(0, 8).map((match) => ({ pin: `D${match[1]}`, value: match[2] as DigitalValue }));
  const events: SimulationEvent[] = [
    { id: "started", message: "Simulation started...", timestamp: new Date().toISOString() },
    { id: "initialized", message: "Arduino initialized.", timestamp: new Date().toISOString() },
  ];

  for (const step of sequence) {
    const pinName = step.pin;
    const value = step.value;
    gpio[pinName] = value;
    events.push({
      id: `${pinName}-${value}-${events.length}`,
      message: `GPIO ${pinName.slice(1)} → ${value}`,
      timestamp: new Date().toISOString(),
    });
    if (pinName === pin) {
      events.push({
        id: `led-${value}-${events.length}`,
        message: `LED → ${value === "HIGH" ? "ON" : "OFF"}`,
        timestamp: new Date().toISOString(),
      });
    }
  }

  if (!matches.length) {
    events.push({ id: "hint", message: "No supported digitalWrite() calls found.", timestamp: new Date().toISOString() });
  }

  const firstStep = sequence[0];
  return {
    running: true,
    gpio,
    ledOn: firstStep?.pin === pin ? firstStep.value === "HIGH" : gpio[pin] === "HIGH",
    events,
    sequence,
    stepIndex: 0,
  };
}

export function advanceSimulation(state: SimulationState): SimulationState {
  if (!state.running || state.sequence.length === 0) return state;

  const stepIndex = (state.stepIndex + 1) % state.sequence.length;
  const step = state.sequence[stepIndex];
  const gpio = { ...state.gpio, [step.pin]: step.value };

  return {
    ...state,
    gpio,
    ledOn: gpio.D13 === "HIGH",
    stepIndex,
    events: [
      ...state.events,
      { id: `tick-${stepIndex}-${Date.now()}`, message: `GPIO ${step.pin.slice(1)} → ${step.value}`, timestamp: new Date().toISOString() },
      ...(step.pin === "D13" ? [{ id: `led-tick-${stepIndex}-${Date.now()}`, message: `LED → ${step.value === "HIGH" ? "ON" : "OFF"}`, timestamp: new Date().toISOString() }] : []),
    ].slice(-30),
  };
}

export class SimulationEngine {
  run(code: string, connectedPins: string[]) {
    return simulateArduinoCode(code, connectedPins);
  }

  stop() {
    return createSimulationState();
  }

  advance(state: SimulationState) {
    return advanceSimulation(state);
  }
}
