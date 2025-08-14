import { useState, useEffect, useRef } from "react";
import type { GameState, PlanePosition } from "./types";

export function useGameLogic() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    isPlaying: false,
    currentGuess: null,
    gameHistory: [],
    streak: 0,
    bestStreak: 0,
    balance: 10000, // Starting balance
    betAmount: 10,
    currentMultiplier: 1.0,
    isAutoBet: false,
    playerCount: 3158,
    gameResult: null,
    winMultiplier: 0,
    lossMultiplier: 0,
  });

  const [planePosition, setPlanePosition] = useState<PlanePosition>({
    x: 0,
    y: 50,
    angle: 0,
  });
  const [showResult, setShowResult] = useState(false);
  const [gameMessage, setGameMessage] = useState("");
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [flightPath, setFlightPath] = useState<{ x: number; y: number }[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [canBet, setCanBet] = useState<boolean>(true);
  const [crashPoint, setCrashPoint] = useState<number>(0);
  const [isCrashed, setIsCrashed] = useState<boolean>(false);

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const gameStartTimeRef = useRef<number>(0);

  // Generate random crash point (1.00x to 100.00x)
  const generateCrashPoint = (): number => {
    // Higher probability for lower multipliers, exponential distribution
    const random = Math.random();
    if (random < 0.7) {
      // 70% chance for 1.00x - 2.00x
      return 1 + Math.random();
    } else if (random < 0.9) {
      // 20% chance for 2.00x - 5.00x
      return 2 + Math.random() * 3;
    } else if (random < 0.98) {
      // 8% chance for 5.00x - 20.00x
      return 5 + Math.random() * 15;
    } else {
      // 2% chance for 20.00x - 100.00x
      return 20 + Math.random() * 80;
    }
  };

  // Generate random multiplier for wins/losses
  const generateRandomMultiplier = (): number => {
    const random = Math.random();
    if (random < 0.6) {
      // 60% chance for 1x - 5x
      return Math.floor(Math.random() * 4) + 1;
    } else if (random < 0.85) {
      // 25% chance for 5x - 15x
      return Math.floor(Math.random() * 10) + 5;
    } else if (random < 0.95) {
      // 10% chance for 15x - 30x
      return Math.floor(Math.random() * 15) + 15;
    } else {
      // 5% chance for 30x - 100x
      return Math.floor(Math.random() * 70) + 30;
    }
  };

  // Calculate smooth curve position based on time and crash point
  const calculateCurvePosition = (time: number): PlanePosition => {
    const elapsedSeconds = time / 1000;
    const crashTime = Math.log(crashPoint) * 2; // Logarithmic growth

    if (elapsedSeconds >= crashTime) {
      // Plane has crashed
      setIsCrashed(true);
      return {
        x: 100,
        y: 0,
        angle: -90,
      };
    }

    // Calculate current multiplier
    const currentMultiplier = Math.pow(Math.E, elapsedSeconds / 2);
    setGameState((prev) => ({ ...prev, currentMultiplier }));

    // Calculate position based on multiplier
    const progress = Math.min(1, elapsedSeconds / crashTime);
    const x = progress * 100;

    // Create a smooth upward curve
    const y = 50 - progress * 40 + Math.sin(progress * Math.PI * 2) * 10;

    // Calculate angle for realistic flight
    const angle = Math.atan2(progress * 40, 1) * (180 / Math.PI) - 10;

    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(10, Math.min(90, y)),
      angle,
    };
  };

  // Start new game
  const startGame = () => {
    setShowStartScreen(false);
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      currentMultiplier: 1.0,
      gameResult: null,
      winMultiplier: 0,
      lossMultiplier: 0,
    }));
    setCrashPoint(generateCrashPoint());
    setShowResult(false);
    setGameMessage("");
    setPlanePosition({ x: 0, y: 50, angle: 0 });
    setFlightPath([]);
    setProgress(0);
    setCanBet(true);
    setIsCrashed(false);
    startTimeRef.current = Date.now();
    gameStartTimeRef.current = Date.now();
  };

  // Place bet
  const placeBet = () => {
    if (!canBet || gameState.balance < gameState.betAmount) return;

    setGameState((prev) => ({
      ...prev,
      balance: prev.balance - prev.betAmount,
    }));
    setCanBet(false);
  };

  // Cash out
  const cashOut = () => {
    if (!gameState.isPlaying || canBet || isCrashed) return;

    const winMultiplier = generateRandomMultiplier();
    const winAmount = gameState.betAmount * winMultiplier;

    setGameState((prev) => ({
      ...prev,
      balance: prev.balance + winAmount,
      gameResult: "win",
      winMultiplier,
      isPlaying: false,
      gameHistory: [...prev.gameHistory, gameState.currentMultiplier],
    }));

    setShowResult(true);
    setGameMessage(
      `Cashed out at ${gameState.currentMultiplier.toFixed(
        2
      )}x! Won ${winAmount.toFixed(2)} BDT`
    );
  };

  // Handle crash
  const handleCrash = () => {
    if (canBet) return; // No bet placed, no loss

    const lossMultiplier = generateRandomMultiplier();
    const lossAmount = gameState.betAmount * lossMultiplier;

    setGameState((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - lossAmount),
      gameResult: "loss",
      lossMultiplier,
      isPlaying: false,
      gameHistory: [...prev.gameHistory, crashPoint],
    }));

    setShowResult(true);
    setGameMessage(
      `Crashed at ${gameState.currentMultiplier.toFixed(
        2
      )}x! Lost ${lossAmount.toFixed(2)} BDT`
    );
  };

  // Update bet amount
  const updateBetAmount = (amount: number) => {
    setGameState((prev) => ({
      ...prev,
      betAmount: Math.max(1, Math.min(prev.balance, amount)),
    }));
  };

  // Toggle auto bet
  const toggleAutoBet = () => {
    setGameState((prev) => ({
      ...prev,
      isAutoBet: !prev.isAutoBet,
    }));
  };

  // Continue game
  const continueGame = () => {
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      currentMultiplier: 1.0,
      gameResult: null,
      winMultiplier: 0,
      lossMultiplier: 0,
    }));
    setCrashPoint(generateCrashPoint());
    setShowResult(false);
    setGameMessage("");
    setPlanePosition({ x: 0, y: 50, angle: 0 });
    setFlightPath([]);
    setProgress(0);
    setCanBet(true);
    setIsCrashed(false);
    startTimeRef.current = Date.now();
    gameStartTimeRef.current = Date.now();
  };

  // Animate airplane
  useEffect(() => {
    if (!gameState.isPlaying) return;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newPosition = calculateCurvePosition(elapsed);

      setPlanePosition(newPosition);

      // Update flight path
      setFlightPath((prev) => {
        const newPath = [...prev, { x: newPosition.x, y: newPosition.y }];
        return newPath.slice(-200);
      });

      // Update progress
      const currentProgress = Math.min(100, (elapsed / 10000) * 100);
      setProgress(currentProgress);

      // Handle crash
      if (isCrashed && !gameState.gameResult) {
        handleCrash();
      }

      // Continue animation if not crashed
      if (!isCrashed) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.isPlaying, canBet, isCrashed, gameState.gameResult]);

  // Auto bet logic
  useEffect(() => {
    if (gameState.isAutoBet && gameState.isPlaying && canBet) {
      const timer = setTimeout(() => {
        placeBet();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.isAutoBet, gameState.isPlaying, canBet]);

  return {
    gameState,
    planePosition,
    showResult,
    gameMessage,
    showStartScreen,
    flightPath,
    progress,
    canBet,
    isCrashed,
    startGame,
    placeBet,
    cashOut,
    continueGame,
    updateBetAmount,
    toggleAutoBet,
  };
}
