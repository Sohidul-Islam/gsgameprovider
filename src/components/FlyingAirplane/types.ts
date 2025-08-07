export interface GameState {
  score: number;
  isPlaying: boolean;
  currentGuess: "high" | "low" | null;
  gameHistory: number[];
  streak: number;
  bestStreak: number;
}

export interface PlanePosition {
  x: number;
  y: number;
  angle: number;
}
