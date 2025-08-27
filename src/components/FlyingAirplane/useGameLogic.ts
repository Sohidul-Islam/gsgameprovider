import { useState, useEffect, useRef } from "react";
import axios from "axios";
import type { GameState, PlanePosition } from "./types";

// API configuration
// const BASE_URL = "http://localhost:3000";
const BASE_URL = "https://glorypos.com/gs-server";
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export function useGameLogic() {
  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get("sessionId");
  const token = urlParams.get("token");

  console.log({ sessionId, token });

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

  // API state
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

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

  // API Functions
  const verifyToken = async () => {
    if (!token) {
      setApiError("No token provided");
      return null;
    }

    try {
      setIsLoading(true);
      setApiError(null);

      const response = await api.get(`/api/games/verify/${token}`);

      if (response.data.success) {
        const { currentBalance, userName, betAmount } = response.data.data;

        // Update game state with user data
        setGameState((prev) => ({
          ...prev,
          balance: currentBalance,
          betAmount: betAmount || 10,
        }));

        showNotificationMessage(`Welcome back, ${userName}!`, 3000);
        setIsVerified(true);
        return response.data.data;
      } else {
        setApiError(response.data.message || "Token verification failed");
        return null;
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Token verification failed";
      setApiError(errorMessage);
      showNotificationMessage(`Error: ${errorMessage}`, 4000);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const sendBetResult = async (
    betStatus: "win" | "loss",
    winAmount: number,
    lossAmount: number,
    multiplier: number,
    betAmount: number
  ) => {
    if (!token || !sessionId) {
      setApiError("Missing token or session ID");
      return;
    }

    try {
      setIsLoading(true);
      setApiError(null);

      const payload = {
        sessionToken: token,
        betStatus,
        winAmount,
        lossAmount,
        gameSessionId: sessionId,
        multiplier,
        betAmount,
      };

      const response = await api.post("/api/games/bet-result", payload);

      if (response.data.success) {
        console.log("Bet result sent successfully:", response.data);
      } else {
        setApiError(response.data.message || "Failed to send bet result");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : (error as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Failed to send bet result";
      setApiError(errorMessage);
      console.error("Error sending bet result:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

    // Clamp time to crash time so last position is preserved at crash
    const clampedElapsed = Math.min(elapsedSeconds, crashTime);

    const probabilityOfCrash = Math.random();
    if (probabilityOfCrash < 0.01) {
      setIsCrashed(true);
    }

    // Flag crash once we reach crash time
    if (elapsedSeconds >= crashTime) {
      setIsCrashed(true);
    }

    // Calculate current multiplier with slower growth
    const currentMultiplier = Math.pow(Math.E, clampedElapsed / 4); // Slower growth (divided by 4 instead of 2)
    setGameState((prev) => ({ ...prev, currentMultiplier }));

    // Calculate position based on progress
    const progress =
      crashTime > 0 ? Math.min(1, clampedElapsed / crashTime) : 0;
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
  const startGame = async () => {
    // Check if token is provided
    if (!token) {
      showNotificationMessage(
        "❌ No token provided. Please provide a valid session token to play.",
        5000
      );
      setApiError(
        "No token provided. Please provide a valid session token to play."
      );
      return;
    }

    setShowStartScreen(false);
    showNotificationMessage("🔐 Verifying your session...", 2000);

    // Verify token - mandatory
    const userData = await verifyToken();
    if (!userData) {
      showNotificationMessage(
        "❌ Session verification failed. Please refresh the page with a valid token.",
        5000
      );
      setShowStartScreen(true); // Return to start screen
      return;
    }

    showNotificationMessage(
      "✅ Session verified! Welcome to Crash Game!",
      3000
    );
    setIsVerified(true);
    startBettingPhase();
  };

  // Place bet
  const placeBet = () => {
    // Check if token is verified (user has started the game)
    if (!token) {
      showNotificationMessage(
        "❌ No token provided. Please provide a valid session token to play.",
        3000
      );
      return;
    }

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
  const cashOut = async () => {
    // Check if token is verified
    if (!token) {
      showNotificationMessage(
        "❌ No token provided. Please provide a valid session token to play.",
        3000
      );
      return;
    }

    if (
      gameState.gamePhase !== "flying" ||
      !gameState.hasPlacedBet ||
      isCrashed
    )
      return;

    // const winMultiplier = generateRandomMultiplier();
    const winAmount = gameState.betAmount * gameState.currentMultiplier;

    setGameState((prev) => ({
      ...prev,
      balance: prev.balance + winAmount,
      gameResult: "win",
      winMultiplier: gameState.currentMultiplier,
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

    // Send bet result to API
    await sendBetResult(
      "win",
      winAmount,
      0,
      gameState.currentMultiplier,
      gameState.betAmount
    );

    // Auto restart after 3 seconds
    restartTimerRef.current = window.setTimeout(() => {
      startBettingPhase();
    }, 3000);
  };

  // Handle crash
  const handleCrash = async () => {
    // Check if token is verified
    if (!token) {
      showNotificationMessage(
        "❌ No token provided. Please provide a valid session token to play.",
        3000
      );
      return;
    }

    // Always handle crash, even if no bet was placed
    if (gameState.hasPlacedBet) {
      // Player had a bet, calculate loss
      const lossMultiplier = generateRandomMultiplier();
      const lossAmount = gameState.betAmount;

      setGameState((prev) => ({
        ...prev,
        balance: Math.max(0, prev.balance),
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
      showNotificationMessage(
        `💥 CRASHED! -${lossAmount.toFixed(2)} BDT`,
        4000
      );

      // Send bet result to API
      await sendBetResult(
        "loss",
        0,
        lossAmount,
        gameState.currentMultiplier,
        gameState.betAmount
      );
    } else {
      // No bet placed, just show crash message
      setGameState((prev) => ({
        ...prev,
        gameResult: "loss",
        gamePhase: "crashed",
        isPlaying: false,
        gameHistory: [...prev.gameHistory, crashPoint],
      }));

      setShowResult(true);
      setGameMessage(`Crashed at ${gameState.currentMultiplier.toFixed(2)}x!`);
      showNotificationMessage("💥 CRASHED! No bet placed", 4000);
    }

    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);

    // Auto restart after 3 seconds (always restart regardless of bet)
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

  // No auto-verification - token must be verified manually through start button

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
    isLoading,
    apiError,
    isVerified,
    startGame,
    placeBet,
    cashOut,
    continueGame,
    updateBetAmount,
    toggleAutoBet,
  };
}
