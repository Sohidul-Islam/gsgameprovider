import { motion, AnimatePresence } from "framer-motion";
import { useGameLogic } from "./useGameLogic";
import StartScreen from "./StartScreen";
import GameHeader from "./GameHeader";
import FlightCanvas from "./FlightCanvas";
import GameControls from "./GameControls";
import GameHistory from "./GameHistory";
import "./FlyingAirplaneGame.css";

export default function FlyingAirplaneGame() {
  const {
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
  } = useGameLogic();

  return (
    <div className="flying-airplane-game">
      <AnimatePresence mode="wait">
        {showStartScreen ? (
          <StartScreen onStartGame={startGame} />
        ) : (
          <motion.div
            key="game"
            className="game-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Header */}
            <GameHeader
              score={gameState.score}
              streak={gameState.streak}
              bestStreak={gameState.bestStreak}
            />

            {/* Game Area */}
            <div className="game-area">
              {/* Flight Canvas */}
              <FlightCanvas
                planePosition={planePosition}
                flightPath={flightPath}
                targetScore={targetScore}
              />

              {/* Game Controls */}
              <GameControls
                isPlaying={gameState.isPlaying}
                onMakeGuess={makeGuess}
                onContinue={continueGame}
                showResult={showResult}
                isCorrect={isCorrect}
                gameMessage={gameMessage}
                progress={progress}
                canGuess={canGuess}
              />
            </div>

            {/* Game History */}
            <GameHistory gameHistory={gameState.gameHistory} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
