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
    gamePhase: "betting",
    bettingTimeLeft: 10, // Changed from 30 to 10 seconds
    hasPlacedBet: false,
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
  const [showNotification, setShowNotification] = useState<string>("");
  const [isShaking, setIsShaking] = useState<boolean>(false);
  const [flightDuration, setFlightDuration] = useState<number>(0); // Random flight duration

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const bettingTimerRef = useRef<number | null>(null);
  const restartTimerRef = useRef<number | null>(null);

  // Show notification with auto-hide
  const showNotificationMessage = (
    message: string,
    duration: number = 3000
  ) => {
    setShowNotification(message);
    setTimeout(() => setShowNotification(""), duration);
  };

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

  // Generate random flight duration (2 to 50 seconds)
  const generateFlightDuration = (): number => {
    // Random distribution with higher probability for shorter flights
    const random = Math.random();
    if (random < 0.6) {
      // 60% chance for 2-10 seconds
      return 2 + Math.random() * 8;
    } else if (random < 0.85) {
      // 25% chance for 10-25 seconds
      return 10 + Math.random() * 15;
    } else if (random < 0.95) {
      // 10% chance for 25-40 seconds
      return 25 + Math.random() * 15;
    } else {
      // 5% chance for 40-50 seconds
      return 40 + Math.random() * 10;
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
    const crashTime = flightDuration; // Use the random flight duration

    if (elapsedSeconds >= crashTime) {
      // Plane has crashed
      setIsCrashed(true);
      return {
        x: 100,
        y: 0,
        angle: -90,
      };
    }

    // Calculate current multiplier with slower growth
    const currentMultiplier = Math.pow(Math.E, elapsedSeconds / 4); // Slower growth (divided by 4 instead of 2)
    setGameState((prev) => ({ ...prev, currentMultiplier }));

    // Calculate position based on multiplier
    const progress = Math.min(1, elapsedSeconds / crashTime);
    const x = progress * 100;

    // Create a smooth upward curve with slower movement
    const y = 50 - progress * 30 + Math.sin(progress * Math.PI * 2) * 8; // Reduced movement range

    // Calculate angle for realistic flight
    const angle = Math.atan2(progress * 30, 1) * (180 / Math.PI) - 8; // Reduced angle

    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(15, Math.min(85, y)),
      angle,
    };
  };

  // Start betting phase
  const startBettingPhase = () => {
    setGameState((prev) => ({
      ...prev,
      gamePhase: "betting",
      bettingTimeLeft: 10, // 10 seconds betting period
      hasPlacedBet: false,
      currentMultiplier: 1.0,
      gameResult: null,
      winMultiplier: 0,
      lossMultiplier: 0,
    }));
    setShowResult(false);
    setGameMessage("");
    setPlanePosition({ x: 0, y: 50, angle: 0 });
    setFlightPath([]);
    setProgress(0);
    setCanBet(true);
    setIsCrashed(false);
    setCrashPoint(generateCrashPoint());
    setFlightDuration(generateFlightDuration()); // Generate random flight duration
    showNotificationMessage("🎲 New round starting! Place your bets!", 2000);

    // Start betting timer
    bettingTimerRef.current = window.setInterval(() => {
      setGameState((prev) => {
        const newTimeLeft = prev.bettingTimeLeft - 1;
        if (newTimeLeft <= 0) {
          // Betting phase ended, start flying phase
          if (bettingTimerRef.current) {
            clearInterval(bettingTimerRef.current);
          }
          showNotificationMessage(
            "🚀 Game starting! Watch the multiplier grow!",
            2000
          );
          return {
            ...prev,
            bettingTimeLeft: 0,
            gamePhase: "flying",
            isPlaying: true,
          };
        }
        // Warning when time is running out
        if (newTimeLeft === 5) {
          showNotificationMessage("⚠️ Only 5 seconds left to bet!", 1500);
        }
        return {
          ...prev,
          bettingTimeLeft: newTimeLeft,
        };
      });
    }, 1000);
  };

  // Start new game
  const startGame = () => {
    setShowStartScreen(false);
    showNotificationMessage("🎮 Welcome to Crash Game! Good luck!", 3000);
    startBettingPhase();
  };

  // Place bet
  const placeBet = () => {
    if (
      !canBet ||
      gameState.balance < gameState.betAmount ||
      gameState.gamePhase !== "betting"
    )
      return;

    setGameState((prev) => ({
      ...prev,
      balance: prev.balance - prev.betAmount,
      hasPlacedBet: true,
    }));
    setCanBet(false);
    setGameMessage("Bet placed! Waiting for game to start...");
    showNotificationMessage(
      `💰 Bet placed: ${gameState.betAmount.toFixed(2)} BDT`,
      2000
    );
  };

  // Cash out
  const cashOut = () => {
    if (
      gameState.gamePhase !== "flying" ||
      !gameState.hasPlacedBet ||
      isCrashed
    )
      return;

    const winMultiplier = generateRandomMultiplier();
    const winAmount = gameState.betAmount * winMultiplier;

    setGameState((prev) => ({
      ...prev,
      balance: prev.balance + winAmount,
      gameResult: "win",
      winMultiplier,
      gamePhase: "crashed",
      isPlaying: false,
      gameHistory: [...prev.gameHistory, gameState.currentMultiplier],
    }));

    setShowResult(true);
    setGameMessage(
      `Cashed out at ${gameState.currentMultiplier.toFixed(
        2
      )}x! Won ${winAmount.toFixed(2)} BDT`
    );
    showNotificationMessage(
      `🎉 CASHED OUT! +${winAmount.toFixed(2)} BDT`,
      4000
    );
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    // Auto restart after 3 seconds
    restartTimerRef.current = window.setTimeout(() => {
      startBettingPhase();
    }, 3000);
  };

  // Handle crash
  const handleCrash = () => {
    if (!gameState.hasPlacedBet) return; // No bet placed, no loss

    const lossMultiplier = generateRandomMultiplier();
    const lossAmount = gameState.betAmount * lossMultiplier;

    setGameState((prev) => ({
      ...prev,
      balance: Math.max(0, prev.balance - lossAmount),
      gameResult: "loss",
      lossMultiplier,
      gamePhase: "crashed",
      isPlaying: false,
      gameHistory: [...prev.gameHistory, crashPoint],
    }));

    setShowResult(true);
    setGameMessage(
      `Crashed at ${gameState.currentMultiplier.toFixed(
        2
      )}x! Lost ${lossAmount.toFixed(2)} BDT`
    );
    showNotificationMessage(`💥 CRASHED! -${lossAmount.toFixed(2)} BDT`, 4000);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    // Auto restart after 3 seconds
    restartTimerRef.current = window.setTimeout(() => {
      startBettingPhase();
    }, 3000);
  };

  // Update bet amount
  const updateBetAmount = (amount: number) => {
    const newAmount = Math.max(1, Math.min(gameState.balance, amount));
    setGameState((prev) => ({
      ...prev,
      betAmount: newAmount,
    }));
  };

  // Toggle auto bet
  const toggleAutoBet = () => {
    setGameState((prev) => ({
      ...prev,
      isAutoBet: !prev.isAutoBet,
    }));
    showNotificationMessage(
      gameState.isAutoBet ? "🔄 Auto-bet disabled" : "🤖 Auto-bet enabled",
      2000
    );
  };

  // Continue game (manual restart)
  const continueGame = () => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
    }
    startBettingPhase();
  };

  // Animate airplane
  useEffect(() => {
    if (gameState.gamePhase !== "flying") return;

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
      const currentProgress = Math.min(
        100,
        (elapsed / (flightDuration * 1000)) * 100
      );
      setProgress(currentProgress);

      // Handle crash
      if (isCrashed && gameState.gamePhase === "flying") {
        handleCrash();
      }

      // Continue animation if not crashed
      if (!isCrashed) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = Date.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.gamePhase, isCrashed, flightDuration]);

  // Auto bet logic
  useEffect(() => {
    if (
      gameState.isAutoBet &&
      gameState.gamePhase === "betting" &&
      canBet &&
      !gameState.hasPlacedBet
    ) {
      const timer = setTimeout(() => {
        placeBet();
      }, 2000); // Auto bet after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [
    gameState.isAutoBet,
    gameState.gamePhase,
    canBet,
    gameState.hasPlacedBet,
  ]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (bettingTimerRef.current) {
        window.clearInterval(bettingTimerRef.current);
      }
      if (restartTimerRef.current) {
        window.clearTimeout(restartTimerRef.current);
      }
    };
  }, []);

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
    showNotification,
    isShaking,
    startGame,
    placeBet,
    cashOut,
    continueGame,
    updateBetAmount,
    toggleAutoBet,
  };
}
