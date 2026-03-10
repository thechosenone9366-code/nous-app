export interface CoupleInfo {
  name1: string;
  name2: string;
  emoji1: string;
  emoji2: string;
  startDate: string; // ISO string
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'partner';
  timestamp: number;
  type: 'text' | 'emoji' | 'special';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string YYYY-MM-DD
  emoji: string;
  note?: string;
  color: 'rose' | 'blue' | 'green' | 'yellow';
}

export interface Photo {
  id: string;
  uri: string;
  caption?: string;
  date: string;
  emoji?: string;
}

export interface Mood {
  emoji: string;
  label: string;
  date: string;
}

export type QuizAnswer = {
  questionId: number;
  correct: boolean;
  date: string;
};

export type RootStackParamList = {
  Setup: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Chat: undefined;
  Games: undefined;
  Calendar: undefined;
  Photos: undefined;
};

export type GamesStackParamList = {
  GamesList: undefined;
  Quiz: undefined;
  TruthOrDare: undefined;
  WouldYouRather: undefined;
};
