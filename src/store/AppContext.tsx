import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CoupleInfo, Message, CalendarEvent, Photo, Mood } from '../utils/types';
import { Storage, KEYS } from '../utils/storage';

interface AppState {
  coupleInfo: CoupleInfo | null;
  messages: Message[];
  events: CalendarEvent[];
  photos: Photo[];
  mood: Mood | null;
  dailyIdx: number;
  isLoading: boolean;
}

type Action =
  | { type: 'LOAD'; payload: Partial<AppState> }
  | { type: 'SET_COUPLE'; payload: CoupleInfo }
  | { type: 'ADD_MSG'; payload: Message }
  | { type: 'ADD_EVENT'; payload: CalendarEvent }
  | { type: 'DEL_EVENT'; payload: string }
  | { type: 'ADD_PHOTO'; payload: Photo }
  | { type: 'DEL_PHOTO'; payload: string }
  | { type: 'SET_MOOD'; payload: Mood }
  | { type: 'NEXT_Q' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD': return { ...state, ...action.payload, isLoading: false };
    case 'SET_COUPLE': return { ...state, coupleInfo: action.payload };
    case 'ADD_MSG': return { ...state, messages: [...state.messages, action.payload] };
    case 'ADD_EVENT':
      return {
        ...state,
        events: [...state.events, action.payload].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
      };
    case 'DEL_EVENT': return { ...state, events: state.events.filter(e => e.id !== action.payload) };
    case 'ADD_PHOTO': return { ...state, photos: [action.payload, ...state.photos] };
    case 'DEL_PHOTO': return { ...state, photos: state.photos.filter(p => p.id !== action.payload) };
    case 'SET_MOOD': return { ...state, mood: action.payload };
    case 'NEXT_Q': return { ...state, dailyIdx: state.dailyIdx + 1 };
    default: return state;
  }
}

interface Actions {
  setCoupleInfo: (i: CoupleInfo) => Promise<void>;
  sendMessage: (text: string) => void;
  addEvent: (e: Omit<CalendarEvent, 'id'>) => Promise<void>;
  deleteEvent: (id: string) => void;
  addPhoto: (p: Omit<Photo, 'id'>) => Promise<void>;
  deletePhoto: (id: string) => void;
  setMood: (m: Mood) => Promise<void>;
  nextDailyQuestion: () => void;
}

interface Ctx {
  state: AppState;
  actions: Actions;
}

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    coupleInfo: null, messages: [], events: [], photos: [],
    mood: null, dailyIdx: 0, isLoading: true,
  });

  useEffect(() => {
    (async () => {
      const [coupleInfo, messages, events, photos, mood, dailyIdx] = await Promise.all([
        Storage.get<CoupleInfo>(KEYS.COUPLE),
        Storage.get<Message[]>(KEYS.MESSAGES),
        Storage.get<CalendarEvent[]>(KEYS.EVENTS),
        Storage.get<Photo[]>(KEYS.PHOTOS),
        Storage.get<Mood>(KEYS.MOOD),
        Storage.get<number>(KEYS.DAILY_IDX),
      ]);
      dispatch({
        type: 'LOAD',
        payload: {
          coupleInfo: coupleInfo ?? null,
          messages: messages ?? [],
          events: events ?? [],
          photos: photos ?? [],
          mood: mood ?? null,
          dailyIdx: dailyIdx ?? 0,
        },
      });
    })();
  }, []);

  useEffect(() => { if (!state.isLoading) Storage.set(KEYS.MESSAGES, state.messages); }, [state.messages]);
  useEffect(() => { if (!state.isLoading) Storage.set(KEYS.EVENTS, state.events); }, [state.events]);
  useEffect(() => { if (!state.isLoading) Storage.set(KEYS.PHOTOS, state.photos); }, [state.photos]);

  function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

  const actions: Actions = {
    setCoupleInfo: async (i) => { await Storage.set(KEYS.COUPLE, i); dispatch({ type: 'SET_COUPLE', payload: i }); },
    sendMessage: (text) => dispatch({ type: 'ADD_MSG', payload: { id: genId(), text, sender: 'me', timestamp: Date.now() } }),
    addEvent: async (e) => dispatch({ type: 'ADD_EVENT', payload: { ...e, id: genId() } }),
    deleteEvent: (id) => dispatch({ type: 'DEL_EVENT', payload: id }),
    addPhoto: async (p) => dispatch({ type: 'ADD_PHOTO', payload: { ...p, id: genId() } }),
    deletePhoto: (id) => dispatch({ type: 'DEL_PHOTO', payload: id }),
    setMood: async (m) => { await Storage.set(KEYS.MOOD, m); dispatch({ type: 'SET_MOOD', payload: m }); },
    nextDailyQuestion: () => { Storage.set(KEYS.DAILY_IDX, state.dailyIdx + 1); dispatch({ type: 'NEXT_Q' }); },
  };

  return <AppContext.Provider value={{ state, actions }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be inside AppProvider');
  return ctx;
}
