"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  HasilKegiatanEntry,
  PendingVisit,
  SessionUser,
  VisitInput,
  VisitRecord,
} from "@/types/posyandu";

interface PosyanduState {
  session: SessionUser | null;
  isOnline: boolean;
  pendingQueue: PendingVisit[];
  localVisits: VisitRecord[];
  localParticipantsVersion: number;
  localHasilKegiatan: HasilKegiatanEntry[];
  setSession: (session: SessionUser | null) => void;
  setOnline: (online: boolean) => void;
  enqueueVisit: (input: VisitInput) => PendingVisit;
  dequeueVisit: (queueId: string) => void;
  addLocalVisit: (visit: VisitRecord) => void;
  setLocalHasilKegiatan: (entries: HasilKegiatanEntry[]) => void;
}

export const usePosyanduStore = create<PosyanduState>()(
  persist(
    (set) => ({
      session: null,
      isOnline: true,
      pendingQueue: [],
      localVisits: [],
      localParticipantsVersion: 0,
      localHasilKegiatan: [],
      setSession: (session) => set({ session }),
      setOnline: (isOnline) => set({ isOnline }),
      enqueueVisit: (input) => {
        const queued: PendingVisit = {
          ...input,
          queueId: `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          queuedAt: new Date().toISOString(),
          offlineQueued: true,
        };
        set((state) => ({ pendingQueue: [...state.pendingQueue, queued] }));
        return queued;
      },
      dequeueVisit: (queueId) =>
        set((state) => ({
          pendingQueue: state.pendingQueue.filter((v) => v.queueId !== queueId),
        })),
      addLocalVisit: (visit) =>
        set((state) => ({ localVisits: [...state.localVisits, visit] })),
      setLocalHasilKegiatan: (entries) =>
        set({ localHasilKegiatan: entries }),
    }),
    {
      name: "posyandu-store",
      partialize: (state) => ({
        session: state.session,
        pendingQueue: state.pendingQueue,
        localVisits: state.localVisits,
        localHasilKegiatan: state.localHasilKegiatan,
      }),
    },
  ),
);

export const selectPendingCount = (s: PosyanduState) => s.pendingQueue.length;
