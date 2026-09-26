"use client";

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { seedInspections } from "./seed";
import type { FacilityKey, Inspection, Rating } from "./types";
import { todayISO } from "./format";

const STORAGE_KEY = "facilityhq.inspections.v1";

/* ------------------------------------------------------------------ */
/* External store (module singleton) — safe for SSR + localStorage     */
/* ------------------------------------------------------------------ */

interface StoreState {
  inspections: Inspection[];
  /** true once localStorage has been read on the client */
  hydrated: boolean;
}

const SERVER_STATE: StoreState = { inspections: seedInspections(), hydrated: false };

let state: StoreState = SERVER_STATE;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function setStore(patch: Partial<StoreState>) {
  state = { ...state, ...patch };
  emit();
}

function persist(list: Inspection[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // storage unavailable / full — keep in-memory state
  }
}

function loadFromStorage() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  let next = SERVER_STATE.inspections;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Inspection[];
      if (Array.isArray(parsed) && parsed.length) next = parsed;
    }
  } catch {
    // corrupt storage → fall back to seed
  }
  setStore({ inspections: next, hydrated: true });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  loadFromStorage();
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return SERVER_STATE;
}

function updateList(updater: (list: Inspection[]) => Inspection[]) {
  const next = updater(state.inspections);
  setStore({ inspections: next });
  persist(next);
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export interface NewInspectionInput {
  facility: FacilityKey;
  location: string;
  department: string;
  evaluator: string;
  inspectionDate: string;
}

interface InspectionsContextValue extends StoreState {
  getInspection: (id: string) => Inspection | undefined;
  createInspection: (input: NewInspectionInput) => Inspection;
  updateInspection: (id: string, patch: Partial<Inspection>) => void;
  setRating: (id: string, itemId: string, rating: Rating | null) => void;
  setItemComment: (id: string, itemId: string, comment: string) => void;
  submitInspection: (id: string) => void;
}

const InspectionsContext = createContext<InspectionsContextValue | null>(null);

function nextId(existing: Inspection[], year: number): string {
  const prefix = `INS-${year}-`;
  const max = existing
    .filter((i) => i.id.startsWith(prefix))
    .map((i) => Number(i.id.slice(prefix.length)))
    .filter((n) => !Number.isNaN(n))
    .reduce((a, b) => Math.max(a, b), 0);
  return `${prefix}${String(max + 1).padStart(4, "0")}`;
}

function createInspection(input: NewInspectionInput): Inspection {
  const year = Number(input.inspectionDate.slice(0, 4)) || new Date().getFullYear();
  const created: Inspection = {
    id: nextId(state.inspections, year),
    facility: input.facility,
    location: input.location,
    department: input.department,
    evaluator: input.evaluator,
    inspectionDate: input.inspectionDate,
    status: "draft",
    responses: {},
    generalComment: "",
    signature: "",
    dateCompleted: "",
    createdAt: new Date().toISOString(),
  };
  updateList((prev) => [created, ...prev]);
  return created;
}

function updateInspection(id: string, patch: Partial<Inspection>) {
  updateList((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
}

function setRating(id: string, itemId: string, rating: Rating | null) {
  updateList((prev) =>
    prev.map((i) => {
      if (i.id !== id) return i;
      const current = i.responses[itemId] ?? { rating: null };
      return { ...i, responses: { ...i.responses, [itemId]: { ...current, rating } } };
    }),
  );
}

function setItemComment(id: string, itemId: string, comment: string) {
  updateList((prev) =>
    prev.map((i) => {
      if (i.id !== id) return i;
      const current = i.responses[itemId] ?? { rating: null };
      return { ...i, responses: { ...i.responses, [itemId]: { ...current, comment } } };
    }),
  );
}

function submitInspection(id: string) {
  updateList((prev) =>
    prev.map((i) =>
      i.id === id
        ? {
            ...i,
            status: "submitted",
            submittedAt: new Date().toISOString(),
            dateCompleted: i.dateCompleted || todayISO(),
          }
        : i,
    ),
  );
}

export function InspectionsProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const value = useMemo<InspectionsContextValue>(
    () => ({
      ...snapshot,
      getInspection: (id) => snapshot.inspections.find((i) => i.id === id),
      createInspection,
      updateInspection,
      setRating,
      setItemComment,
      submitInspection,
    }),
    [snapshot],
  );

  return <InspectionsContext.Provider value={value}>{children}</InspectionsContext.Provider>;
}

export function useInspections(): InspectionsContextValue {
  const ctx = useContext(InspectionsContext);
  if (!ctx) throw new Error("useInspections must be used within InspectionsProvider");
  return ctx;
}
