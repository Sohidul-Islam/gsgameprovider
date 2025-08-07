import { useState, useEffect, useRef } from "react";
import { GameState, PlanePosition } from "./types";

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
    x: 50,
    y: 50,
    angle: 0,
  });
  const [targetScore, setTargetScore] = useState<number>(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameMessage, setGameMessage] = useState("");
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [flightPath, setFlightPath] = useState<{ x: number; y: number }[]>([]);

  const animationRef = useRef<number | null>(null);

  // Generate random target score
  const generateTargetScore = (): number => {
    return Math.floor(Math.random() * 100) + 1;
  };

  // Calculate curve position based on time
  const calculateCurvePosition = (time: number): PlanePosition => {
    const x = (time / 100) * 100; // Move across screen
    const y = 50 + Math.sin(time * 0.02) * 30; // Sine wave curve
    const angle = Math.cos(time * 0.02) * 15; // Angle based on curve direction

    return { x: Math.max(0, Math.min(100, x)), y, angle };
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
  };

  // Make a guess
  const makeGuess = (guess: "high" | "low") => {
    if (!gameState.isPlaying) return;

    setGameState((prev) => ({
      ...prev,
      currentGuess: guess,
    }));

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
  };

  // Animate airplane along curve
  useEffect(() => {
    if (!gameState.isPlaying) return;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newPosition = calculateCurvePosition(elapsed);

      setPlanePosition(newPosition);

      // Update flight path
      setFlightPath((prev) => [
        ...prev,
        { x: newPosition.x, y: newPosition.y },
      ]);

      // Continue animation if plane hasn't reached the end
      if (newPosition.x < 100) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.isPlaying]);

  return {
    gameState,
    planePosition,
    targetScore,
    showResult,
    isCorrect,
    gameMessage,
    showStartScreen,
    flightPath,
    startGame,
    makeGuess,
    continueGame,
  };
} 