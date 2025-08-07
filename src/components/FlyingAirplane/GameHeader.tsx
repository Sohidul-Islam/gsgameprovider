import { motion } from "framer-motion";

interface GameHeaderProps {
  score: number;
  streak: number;
  bestStreak: number;
}

export default function GameHeader({ score, streak, bestStreak }: GameHeaderProps) {
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
          <span className="label">Score:</span>
          <motion.span
            className="value"
            key={score}
            initial={{ scale: 1.2, color: "#4ecdc4" }}
            animate={{ scale: 1, color: "#4ecdc4" }}
            transition={{ duration: 0.4 }}
          >
            {score}
          </motion.span>
        </motion.div>
        <motion.div
          className="score-item"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="label">Streak:</span>
          <motion.span
            className="value"
            key={streak}
            initial={{ scale: 1.2, color: "#ff6b6b" }}
            animate={{ scale: 1, color: "#4ecdc4" }}
            transition={{ duration: 0.4 }}
          >
            {streak}
          </motion.span>
        </motion.div>
        <motion.div
          className="score-item"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="label">Best:</span>
          <span className="value">{bestStreak}</span>
        </motion.div>
      </div>
    </motion.div>
  );
} 