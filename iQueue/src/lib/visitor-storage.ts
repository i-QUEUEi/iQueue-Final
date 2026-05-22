export type VisitorRequestStatus = 'pending' | 'confirmed';

export interface VisitorRequest {
  id: string;
  name: string;
  office: string;
  branchId: string;
  branchName: string;
  service: string;
  visitDate: string;
  visitTime: string;
  contact?: string;
  notes?: string;
  status: VisitorRequestStatus;
  createdAt: string;
}

export interface VisitorFeedback {
  id: string;
  office: string;
  branchId: string;
  branchName: string;
  date: string;
  time: string;
  waitTime: string;
  crowdLevel: string;
  systemIssue: string;
  waitingCount: string;
  predictionMatch: string;
  comments?: string;
  submittedAt: string;
}

const VISITOR_REQUESTS_KEY = 'visitorRequests';
const VISITOR_FEEDBACK_KEY = 'visitorFeedback';
export const VISITOR_REQUESTS_UPDATED_EVENT = 'visitorRequestsUpdated';
export const VISITOR_FEEDBACK_UPDATED_EVENT = 'visitorFeedbackUpdated';

function loadPersisted<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function dispatchUpdateEvent(eventName: string) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(eventName));
}

function isVisitorStorageKey(key: string | null) {
  return key === VISITOR_REQUESTS_KEY || key === VISITOR_FEEDBACK_KEY;
}

function savePersisted<T>(key: string, items: T[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(items));

  if (key === VISITOR_REQUESTS_KEY) {
    dispatchUpdateEvent(VISITOR_REQUESTS_UPDATED_EVENT);
  }

  if (key === VISITOR_FEEDBACK_KEY) {
    dispatchUpdateEvent(VISITOR_FEEDBACK_UPDATED_EVENT);
  }
}

export function loadVisitorRequests(): VisitorRequest[] {
  return loadPersisted<VisitorRequest>(VISITOR_REQUESTS_KEY);
}

export function saveVisitorRequests(requests: VisitorRequest[]) {
  savePersisted<VisitorRequest>(VISITOR_REQUESTS_KEY, requests);
}

export function addVisitorRequest(request: VisitorRequest) {
  const requests = loadVisitorRequests();
  saveVisitorRequests([...requests, request]);
}

export function loadVisitorFeedback(): VisitorFeedback[] {
  return loadPersisted<VisitorFeedback>(VISITOR_FEEDBACK_KEY);
}

export function saveVisitorFeedback(feedback: VisitorFeedback[]) {
  savePersisted<VisitorFeedback>(VISITOR_FEEDBACK_KEY, feedback);
}

export function addVisitorFeedback(entry: VisitorFeedback) {
  const feedback = loadVisitorFeedback();
  saveVisitorFeedback([...feedback, entry]);
}

export function subscribeToVisitorStorageChanges(listener: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.storageArea !== window.localStorage) return;
    if (!isVisitorStorageKey(event.key)) return;
    listener();
  };

  window.addEventListener(VISITOR_REQUESTS_UPDATED_EVENT, listener);
  window.addEventListener(VISITOR_FEEDBACK_UPDATED_EVENT, listener);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(VISITOR_REQUESTS_UPDATED_EVENT, listener);
    window.removeEventListener(VISITOR_FEEDBACK_UPDATED_EVENT, listener);
    window.removeEventListener('storage', handleStorage);
  };
}
