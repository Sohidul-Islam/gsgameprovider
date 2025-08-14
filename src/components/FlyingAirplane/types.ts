export interface GameState {
  score: number;
  isPlaying: boolean;
  currentGuess: "high" | "low" | null;
  gameHistory: number[];
  streak: number;
  bestStreak: number;
  balance: number;
  betAmount: number;
  currentMultiplier: number;
  isAutoBet: boolean;
  playerCount: number;
  gameResult: "win" | "loss" | null;
  winMultiplier: number;
  lossMultiplier: number;
}

export interface PlanePosition {
  x: number;
  y: number;
  angle: number;
}

export interface BettingPanel {
  betAmount: number;
  isAutoBet: boolean;
  quickBetOptions: number[];
}
