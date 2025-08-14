import { motion } from "framer-motion";

interface GameHeaderProps {
  balance: number;
  betAmount: number;
  currentMultiplier: number;
  playerCount: number;
}

export default function GameHeader({
  balance,
  betAmount,
  currentMultiplier,
  playerCount,
}: GameHeaderProps) {
  return (
    <motion.div
      className="game-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
    >
      <div className="score-info">
        <motion.div
          className="score-item"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="label">Balance:</span>
          <motion.span
            className="value"
            key={balance}
            initial={{ scale: 1.2, color: "#22c55e" }}
            animate={{ scale: 1, color: "#22c55e" }}
            transition={{ duration: 0.4 }}
          >
            {balance.toFixed(2)} BDT
          </motion.span>
        </motion.div>
        <motion.div
          className="score-item"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="label">Bet Amount:</span>
          <motion.span
            className="value"
            key={betAmount}
            initial={{ scale: 1.2, color: "#f59e0b" }}
            animate={{ scale: 1, color: "#f59e0b" }}
            transition={{ duration: 0.4 }}
          >
            {betAmount.toFixed(2)} BDT
          </motion.span>
        </motion.div>
        <motion.div
          className="score-item"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="label">Multiplier:</span>
          <motion.span
            className="value"
            key={currentMultiplier}
            initial={{ scale: 1.2, color: "#ff4444" }}
            animate={{ scale: 1, color: "#ff4444" }}
            transition={{ duration: 0.4 }}
          >
            {currentMultiplier.toFixed(2)}x
          </motion.span>
        </motion.div>
        <motion.div
          className="score-item"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="label">Players:</span>
          <motion.span
            className="value"
            key={playerCount}
            initial={{ scale: 1.2, color: "#4a90e2" }}
            animate={{ scale: 1, color: "#4a90e2" }}
            transition={{ duration: 0.4 }}
          >
            {playerCount.toLocaleString()}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}
