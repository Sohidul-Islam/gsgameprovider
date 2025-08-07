import { motion } from "framer-motion";

interface GameHistoryProps {
  gameHistory: number[];
}

export default function GameHistory({ gameHistory }: GameHistoryProps) {
  return (
    <motion.div
      className="game-history"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      <h3>Recent Scores</h3>
      <div className="history-list">
        {gameHistory.slice(-5).map((score, index) => (
          <motion.div
            key={index}
            className="history-item"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.1 * index,
              type: "spring",
              stiffness: 300,
              duration: 0.6,
            }}
            whileHover={{ scale: 1.1 }}
          >
            {score}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
} 