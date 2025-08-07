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
  });

  const [planePosition, setPlanePosition] = useState<PlanePosition>({
    x: 0,
    y: 50,
    angle: 0,
  });
  const [targetScore, setTargetScore] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameMessage, setGameMessage] = useState("");
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [flightPath, setFlightPath] = useState<{ x: number; y: number }[]>([]);
  const [progress, setProgress] = useState<number>(0); // Progress percentage (0-100)
  const [canGuess, setCanGuess] = useState<boolean>(false); // Whether player can still guess

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Generate random target score
  const generateTargetScore = (): number => {
    return Math.floor(Math.random() * 100) + 1;
  };

  // Calculate smooth curve position based on time
  const calculateCurvePosition = (time: number): PlanePosition => {
    // Slower, smoother movement across the screen
    const x = Math.min(100, (time / 8000) * 100); // Takes 8 seconds to cross screen

    // Create a smoother sine wave with multiple cycles
    const progress = x / 100;
    const y = 50 + Math.sin(progress * Math.PI * 3) * 35; // 3 cycles, smaller amplitude

    // Calculate angle based on the derivative of the curve for realistic rotation
    const angle = Math.cos(progress * Math.PI * 3) * 20; // Smoother angle changes

    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(10, Math.min(90, y)), // Keep within bounds
      angle,
    };
  };

  // Start new game
  const startGame = () => {
    setShowStartScreen(false);
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
      score: 0,
      streak: 0,
      gameHistory: [],
    }));
    setTargetScore(generateTargetScore());
    setShowResult(false);
    setGameMessage("");
    setPlanePosition({ x: 0, y: 50, angle: 0 });
    setFlightPath([]);
    setProgress(0);
    setCanGuess(true);
    startTimeRef.current = Date.now();
  };

  // Make a guess
  const makeGuess = (guess: "high" | "low") => {
    if (!gameState.isPlaying || !canGuess) return;

    setGameState((prev) => ({
      ...prev,
      currentGuess: guess,
    }));

    // Disable guessing after player makes a guess
    setCanGuess(false);

    // Simulate score movement
    const finalScore = Math.floor(Math.random() * 100) + 1;
    const isCorrectGuess =
      (guess === "high" && finalScore > targetScore) ||
      (guess === "low" && finalScore < targetScore);

    setIsCorrect(isCorrectGuess);
    setShowResult(true);

    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        score: prev.score + (isCorrectGuess ? 10 : -5),
        streak: isCorrectGuess ? prev.streak + 1 : 0,
        bestStreak: isCorrectGuess
          ? Math.max(prev.bestStreak, prev.streak + 1)
          : prev.bestStreak,
        gameHistory: [...prev.gameHistory, finalScore],
        isPlaying: false,
        currentGuess: null,
      }));
      setShowResult(false);
      setGameMessage(isCorrectGuess ? "Correct! 🎉" : "Wrong! 😔");
    }, 2000);
  };

  // Continue game
  const continueGame = () => {
    setTargetScore(generateTargetScore());
    setGameState((prev) => ({
      ...prev,
      isPlaying: true,
    }));
    setShowResult(false);
    setGameMessage("");
    setPlanePosition({ x: 0, y: 50, angle: 0 });
    setFlightPath([]);
    setProgress(0);
    setCanGuess(true);
    startTimeRef.current = Date.now();
  };

  // Animate airplane along curve with smooth movement
  useEffect(() => {
    if (!gameState.isPlaying) return;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newPosition = calculateCurvePosition(elapsed);

      // Always update plane position and flight path from the start
      setPlanePosition(newPosition);

      // Update flight path more frequently for smoother trail
      setFlightPath((prev) => {
        const newPath = [...prev, { x: newPosition.x, y: newPosition.y }];
        // Keep only the last 200 points to prevent memory issues
        return newPath.slice(-200);
      });

      // Update progress
      const currentProgress = Math.min(100, (elapsed / 8000) * 100);
      setProgress(currentProgress);

      // Disable guessing when progress reaches 80% (giving player time to see the result)
      if (currentProgress >= 80 && canGuess) {
        setCanGuess(false);
        setGameMessage("Time's up! No more guessing allowed.");
      }

      // Continue animation if plane hasn't reached the end
      if (newPosition.x < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Plane reached the end, stop animation
        setGameState((prev) => ({
          ...prev,
          isPlaying: false,
        }));
        setCanGuess(false);
        if (!gameState.currentGuess) {
          setGameMessage("You didn't make a guess! -5 points");
          setGameState((prev) => ({
            ...prev,
            score: prev.score - 5,
            gameHistory: [
              ...prev.gameHistory,
              Math.floor(Math.random() * 100) + 1,
            ],
          }));
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.isPlaying, canGuess, gameState.currentGuess]);

  return {
    gameState,
    planePosition,
    targetScore,
    showResult,
    isCorrect,
    gameMessage,
    showStartScreen,
    flightPath,
    progress,
    canGuess,
    startGame,
    makeGuess,
    continueGame,
  };
}
