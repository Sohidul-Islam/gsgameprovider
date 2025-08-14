import { motion } from "framer-motion";

interface StartScreenProps {
  onStartGame: () => void;
}

export default function StartScreen({ onStartGame }: StartScreenProps) {
  return (
    <motion.div
      key="start"
      className="start-screen"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="start-content"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <motion.h1
          className="game-title"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🚀 Crash Game
        </motion.h1>
        <motion.p
          className="game-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Place your bet and watch the multiplier grow! Cash out before the
          plane crashes to win big. The higher the multiplier, the bigger your
          payout - but be careful, it can crash at any moment!
        </motion.p>
        <motion.button
          className="start-button"
          onClick={onStartGame}
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Start Betting
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
