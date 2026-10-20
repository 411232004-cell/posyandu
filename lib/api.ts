import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
  type Firestore,
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { getDb, getFirebaseApp, isFirebaseConfigured } from "@/lib/firebase";
import {
  demoEvents,
  demoHasilKegiatan,
  demoParticipants,
  demoUsers,
  demoVisits,
} from "@/lib/demo-data";
import type {
  DashboardStats,
  HasilKegiatanEntry,
  ParticipantRecord,
  PosyanduEvent,
  SessionUser,
  UserRecord,
  VisitInput,
  VisitRecord,
} from "@/types/posyandu";
import { firestoreCollections } from "@/types/posyandu";
import { usePosyanduStore } from "@/lib/store";

export { isFirebaseConfigured };

function nowIso() {
  return new Date().toISOString();
}

function requireDb(): Firestore {
  const db = getDb();
  if (!db) throw new Error("Firestore belum dikonfigurasi");
  return db;
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<SessionUser> {
  if (!isFirebaseConfigured) {
    const match = demoUsers.find((u) => u.email === email);
    if (!match) throw new Error("Email tidak ditemukan (mode demo)");
    return toSession(match);
  }
  const app = getFirebaseApp();
  if (!app) throw new Error("Firebase belum siap");
  const cred = await signInWithEmailAndPassword(getAuth(app), email, password);
  const profile = await fetchUserProfile(cred.user.uid);
  return profile ?? {
    uid: cred.user.uid,
    name: cred.user.displayName ?? cred.user.email ?? "Pengguna",
    role: "warga",
    email: cred.user.email ?? undefined,
  };
}

export async function signOutSession(): Promise<void> {
  const app = getFirebaseApp();
  if (app) await signOut(getAuth(app));
}

export function watchAuth(callback: (user: User | null) => void) {
  const app = getFirebaseApp();
  if (!app) return () => undefined;
  return onAuthStateChanged(getAuth(app), callback);
}

async function fetchUserProfile(uid: string): Promise<SessionUser | null> {
  const db = requireDb();
  const snap = await getDoc(doc(db, firestoreCollections.users, uid));
  if (!snap.exists()) return null;
  return toSession({ id: snap.id, ...(snap.data() as Omit<UserRecord, "id">) });
}

function toSession(u: UserRecord): SessionUser {
  return {
    uid: u.id,
    name: u.name,
    role: u.role,
    email: u.email,
    villageId: u.villageId,
    wargaId: u.role === "warga" ? u.id : undefined,
  };
}

export function demoLogin(role: SessionUser["role"]): SessionUser {
  const found = demoUsers.find((u) => u.role === role) ?? demoUsers[0];
  return toSession(found);
}

export async function listParticipants(): Promise<ParticipantRecord[]> {
  if (!isFirebaseConfigured) return demoParticipants;
  const db = requireDb();
  const snap = await getDocs(collection(db, firestoreCollections.participants));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ParticipantRecord);
}

export async function findParticipantByNik(
  nik: string,
): Promise<ParticipantRecord | null> {
  if (!isFirebaseConfigured) {
    return demoParticipants.find((p) => p.nik === nik) ?? null;
  }
  const db = requireDb();
  const snap = await getDocs(
    query(
      collection(db, firestoreCollections.participants),
      where("nik", "==", nik),
    ),
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as ParticipantRecord;
}

export async function listVisits(
  participantId?: string,
): Promise<VisitRecord[]> {
  const local = usePosyanduStore.getState().localVisits;
  const localFor = participantId
    ? local.filter((v) => v.participantId === participantId)
    : local;
  if (!isFirebaseConfigured) {
    const base = participantId
      ? demoVisits.filter((v) => v.participantId === participantId)
      : demoVisits;
    return [...base, ...localFor];
  }
  const db = requireDb();
  const coll = collection(db, firestoreCollections.visits);
  const snap = participantId
    ? await getDocs(query(coll, where("participantId", "==", participantId)))
    : await getDocs(query(coll, orderBy("date", "desc")));
  return [...snap.docs.map((d) => ({ id: d.id, ...d.data() }) as VisitRecord), ...localFor];
}

export async function listEvents(): Promise<PosyanduEvent[]> {
  if (!isFirebaseConfigured) return demoEvents;
  const db = requireDb();
  const snap = await getDocs(
    query(collection(db, firestoreCollections.posyanduEvents), orderBy("date")),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PosyanduEvent);
}

export async function listHasilKegiatan(
  monthKey?: string,
): Promise<HasilKegiatanEntry[]> {
  const localEntries = usePosyanduStore.getState().localHasilKegiatan;
  const localOnly = monthKey
    ? localEntries.filter((entry) => entry.monthKey === monthKey)
    : localEntries;

  if (!isFirebaseConfigured) {
    const base = monthKey
      ? demoHasilKegiatan.filter((entry) => entry.monthKey === monthKey)
      : demoHasilKegiatan;
    return [...base, ...localOnly];
  }

  const db = requireDb();
  const snapshot = monthKey
    ? await getDocs(
        query(
          collection(db, firestoreCollections.hasilKegiatan),
          where("monthKey", "==", monthKey),
        ),
      )
    : await getDocs(collection(db, firestoreCollections.hasilKegiatan));

  const cloudEntries = snapshot.docs.flatMap((doc) => {
    const data = doc.data() as { entries?: HasilKegiatanEntry[] };
    return Array.isArray(data.entries) ? data.entries : [];
  });

  return [...cloudEntries, ...localOnly];
}

export async function saveHasilKegiatan(
  entries: HasilKegiatanEntry[],
  submittedBy: string,
  role: SessionUser["role"],
  monthKey = new Date().toISOString().slice(0, 7),
): Promise<HasilKegiatanEntry[]> {
  const timestamp = nowIso();
  const normalizedEntries = entries.map((entry) => ({
    ...entry,
    monthKey,
    submittedBy,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));

  if (!isFirebaseConfigured || !usePosyanduStore.getState().isOnline) {
    usePosyanduStore.getState().setLocalHasilKegiatan(normalizedEntries);
    return normalizedEntries;
  }

  const db = requireDb();
  await addDoc(collection(db, firestoreCollections.hasilKegiatan), {
    monthKey,
    submittedBy,
    role,
    entries: normalizedEntries,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return normalizedEntries;
}

export async function recordVisit(input: VisitInput): Promise<VisitRecord> {
  const base: VisitRecord = {
    id: `v-${Date.now()}`,
    ...input,
    syncedAt: nowIso(),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  const { isOnline, enqueueVisit, addLocalVisit } = usePosyanduStore.getState();

  if (!isFirebaseConfigured || !isOnline) {
    enqueueVisit(input);
    addLocalVisit({ ...base, offlineQueued: true });
    return { ...base, offlineQueued: true };
  }

  const db = requireDb();
  const ref = await addDoc(collection(db, firestoreCollections.visits), {
    ...input,
    syncedAt: nowIso(),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  });
  return { ...base, id: ref.id };
}

export async function flushPendingQueue(): Promise<number> {
  const { pendingQueue, dequeueVisit } = usePosyanduStore.getState();
  if (!isFirebaseConfigured || pendingQueue.length === 0) return 0;
  const db = requireDb();
  let synced = 0;
  for (const item of pendingQueue) {
    const { queueId, queuedAt, ...payload } = item;
    await addDoc(collection(db, firestoreCollections.visits), {
      ...payload,
      syncedAt: nowIso(),
      createdAt: queuedAt,
      updatedAt: nowIso(),
    });
    dequeueVisit(queueId);
    synced += 1;
  }
  return synced;
}

export function computeDashboardStats(
  visits: VisitRecord[],
  participants: ParticipantRecord[],
): DashboardStats {
  const monthKey = new Date().toISOString().slice(0, 7);
  const thisMonth = visits.filter((v) => v.monthKey === monthKey);
  const attended = new Set(thisMonth.map((v) => v.participantId));
  const balita = participants.filter((p) => p.participantType === "balita");
  const statusBreakdown: DashboardStats["statusBreakdown"] = {
    normal: 0,
    warning: 0,
    at_risk: 0,
    stunting: 0,
  };
  thisMonth.forEach((v) => {
    statusBreakdown[v.statusGizi] += 1;
  });
  const stuntingCount = statusBreakdown.stunting + statusBreakdown.at_risk;
  return {
    attendancePct: balita.length
      ? Math.round((attended.size / participants.length) * 1000) / 10
      : 0,
    stuntingPct: thisMonth.length
      ? Math.round((stuntingCount / thisMonth.length) * 1000) / 10
      : 0,
    immunizationDone: thisMonth.reduce(
      (acc, v) => acc + v.immunizations.length + (v.vitaminA ? 1 : 0),
      0,
    ),
    visitsThisMonth: thisMonth.length,
    dOverS: { d: attended.size, s: participants.length },
    statusBreakdown,
  };
}
