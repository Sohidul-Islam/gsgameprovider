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
          className="score-item balance-item"
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="item-icon">💰</div>
          <div className="item-content">
            <span className="label">Balance</span>
            <motion.span
              className="value balance-value"
              key={balance}
              initial={{ scale: 1.2, color: "#22c55e" }}
              animate={{ scale: 1, color: "#22c55e" }}
              transition={{ duration: 0.4 }}
            >
              {balance.toFixed(2)}
            </motion.span>
            <span className="currency">BDT</span>
          </div>
        </motion.div>

        <motion.div
          className="score-item bet-item"
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="item-icon">🎯</div>
          <div className="item-content">
            <span className="label">Bet Amount</span>
            <motion.span
              className="value bet-value"
              key={betAmount}
              initial={{ scale: 1.2, color: "#f59e0b" }}
              animate={{ scale: 1, color: "#f59e0b" }}
              transition={{ duration: 0.4 }}
            >
              {betAmount.toFixed(2)}
            </motion.span>
            <span className="currency">BDT</span>
          </div>
        </motion.div>

        <motion.div
          className="score-item multiplier-item"
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="item-icon">⚡</div>
          <div className="item-content">
            <span className="label">Multiplier</span>
            <motion.span
              className="value multiplier-value"
              key={currentMultiplier}
              initial={{ scale: 1.2, color: "#ff4444" }}
              animate={{ scale: 1, color: "#ff4444" }}
              transition={{ duration: 0.4 }}
            >
              {currentMultiplier.toFixed(2)}x
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          className="score-item players-item"
          whileHover={{ scale: 1.05, y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="item-icon">👥</div>
          <div className="item-content">
            <span className="label">Players</span>
            <motion.span
              className="value players-value"
              key={playerCount}
              initial={{ scale: 1.2, color: "#4a90e2" }}
              animate={{ scale: 1, color: "#4a90e2" }}
              transition={{ duration: 0.4 }}
            >
              {playerCount.toLocaleString()}
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
