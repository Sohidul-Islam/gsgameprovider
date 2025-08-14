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
    startGame,
    placeBet,
    cashOut,
    continueGame,
    updateBetAmount,
    toggleAutoBet,
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
