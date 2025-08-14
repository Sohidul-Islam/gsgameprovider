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
  } = useGameLogic();

  return (
    <div className={`flying-airplane-game ${isShaking ? "shake" : ""}`}>
      {/* Notification System */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="notification"
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="notification-text">{showNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

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
              balance={gameState.balance}
              betAmount={gameState.betAmount}
              currentMultiplier={gameState.currentMultiplier}
              playerCount={gameState.playerCount}
            />

            {/* Game Area */}
            <div className="game-area">
              {/* Flight Canvas */}
              <FlightCanvas
                planePosition={planePosition}
                flightPath={flightPath}
                currentMultiplier={gameState.currentMultiplier}
                playerCount={gameState.playerCount}
                isCrashed={isCrashed}
                gamePhase={gameState.gamePhase}
              />

              {/* Game Controls */}
              <GameControls
                isPlaying={gameState.isPlaying}
                onPlaceBet={placeBet}
                onCashOut={cashOut}
                onContinue={continueGame}
                showResult={showResult}
                gameMessage={gameMessage}
                progress={progress}
                canBet={canBet}
                isCrashed={isCrashed}
                balance={gameState.balance}
                betAmount={gameState.betAmount}
                currentMultiplier={gameState.currentMultiplier}
                isAutoBet={gameState.isAutoBet}
                onUpdateBetAmount={updateBetAmount}
                onToggleAutoBet={toggleAutoBet}
                gameResult={gameState.gameResult}
                bettingTimeLeft={gameState.bettingTimeLeft}
                gamePhase={gameState.gamePhase}
                hasPlacedBet={gameState.hasPlacedBet}
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
