import { motion, AnimatePresence } from "framer-motion";

interface GameControlsProps {
  isPlaying: boolean;
  onMakeGuess: (guess: "high" | "low") => void;
  onContinue: () => void;
  showResult: boolean;
  isCorrect: boolean;
  gameMessage: string;
  progress: number;
  canGuess: boolean;
}

export default function GameControls({
  isPlaying,
  onMakeGuess,
  onContinue,
  showResult,
  isCorrect,
  gameMessage,
  progress,
  canGuess,
}: GameControlsProps) {
  return (
    <motion.div
      className="game-controls"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      {isPlaying ? (
        <motion.div
          className="guess-section"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {/* Progress Bar */}
          <motion.div
            className="progress-container"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div className="progress-label">
              Progress: {Math.round(progress)}%
            </div>
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
                style={{
                  background: progress >= 80 
                    ? "linear-gradient(45deg, #ff6b6b, #ff8e8e)" 
                    : "linear-gradient(45deg, #4ecdc4, #6dd5ed)"
                }}
              />
            </div>
            {progress >= 80 && (
              <motion.div
                className="time-up-warning"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                ⏰ Time's up! No more guessing!
              </motion.div>
            )}
          </motion.div>

          {/* Guess Buttons */}
          <motion.div
            className="guess-buttons"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.button
              className={`guess-button high ${!canGuess ? 'disabled' : ''}`}
              onClick={() => onMakeGuess("high")}
              disabled={!isPlaying || !canGuess}
              whileHover={canGuess ? { scale: 1.05, y: -3 } : {}}
              whileTap={canGuess ? { scale: 0.95 } : {}}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                delay: 0.7,
                type: "spring",
                stiffness: 300,
                duration: 0.6,
              }}
            >
              🚀 Fly High
            </motion.button>
            <motion.button
              className={`guess-button low ${!canGuess ? 'disabled' : ''}`}
              onClick={() => onMakeGuess("low")}
              disabled={!isPlaying || !canGuess}
              whileHover={canGuess ? { scale: 1.05, y: -3 } : {}}
              whileTap={canGuess ? { scale: 0.95 } : {}}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                delay: 0.8,
                type: "spring",
                stiffness: 300,
                duration: 0.6,
              }}
            >
              📉 Fly Low
            </motion.button>
          </motion.div>

          {/* Guessing Status */}
          <motion.div
            className="guessing-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            {canGuess ? (
              <span className="status-active">✅ You can still guess!</span>
            ) : (
              <span className="status-disabled">❌ Guessing disabled</span>
            )}
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="result-section"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence>
            {showResult && (
              <motion.div
                className={`result ${isCorrect ? "correct" : "incorrect"}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {isCorrect ? "✅ Correct!" : "❌ Wrong!"}
              </motion.div>
            )}
          </AnimatePresence>
          {gameMessage && (
            <motion.div
              className="game-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              {gameMessage}
            </motion.div>
          )}
          <motion.button
            className="continue-button"
            onClick={onContinue}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Continue
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
} 