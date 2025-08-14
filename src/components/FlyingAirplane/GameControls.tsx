import React from "react";
import "./GameControls.css";
import { motion } from "framer-motion";

interface GameControlsProps {
  isPlaying: boolean;
  onPlaceBet: () => void;
  onCashOut: () => void;
  onContinue: () => void;
  showResult: boolean;
  gameMessage: string;
  progress: number;
  canBet: boolean;
  isCrashed: boolean;
  balance: number;
  betAmount: number;
  currentMultiplier: number;
  isAutoBet: boolean;
  onUpdateBetAmount: (amount: number) => void;
  onToggleAutoBet: () => void;
  gameResult: "win" | "loss" | null;
  bettingTimeLeft: number;
  gamePhase: "betting" | "flying" | "crashed";
  hasPlacedBet: boolean;
}

export default function GameControls({
  isPlaying,
  onPlaceBet,
  onCashOut,
  onContinue,
  showResult,
  gameMessage,
  progress,
  canBet,
  isCrashed,
  balance,
  betAmount,
  currentMultiplier,
  isAutoBet,
  onUpdateBetAmount,
  onToggleAutoBet,
  gameResult,
  bettingTimeLeft,
  gamePhase,
  hasPlacedBet,
}: GameControlsProps) {
  const quickBetOptions = [100, 200, 500, 10000];

  console.log({
    isPlaying,
    progress,
  });

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    onUpdateBetAmount(value);
  };

  const handleIncrement = () => {
    onUpdateBetAmount(betAmount + 10);
  };

  const handleDecrement = () => {
    onUpdateBetAmount(Math.max(1, betAmount - 10));
  };

  const handleQuickBet = (amount: number) => {
    onUpdateBetAmount(amount);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (bettingTimeLeft <= 3) return "#ff4444";
    if (bettingTimeLeft <= 5) return "#f59e0b";
    return "#22c55e";
  };

  return (
    <div>
      {/* Betting Timer */}
      {gamePhase === "betting" && (
        <motion.div
          className="betting-timer"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="timer-display">
            <span className="timer-label">⏰ Betting Time</span>
            <span
              className={`timer-value ${bettingTimeLeft <= 5 ? "urgent" : ""}`}
              style={{ color: getTimerColor() }}
            >
              {formatTime(bettingTimeLeft)}
            </span>
          </div>
          <div className="timer-progress">
            <div
              className="timer-fill"
              style={{
                width: `${((10 - bettingTimeLeft) / 10) * 100}%`,
                background: `linear-gradient(90deg, ${getTimerColor()}, ${getTimerColor()}80)`,
              }}
            />
          </div>
        </motion.div>
      )}

      {hasPlacedBet && gamePhase === "betting" && (
        <motion.div
          className="bet-status"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="status-text">
            ⏳ Bet confirmed! Waiting for game to start...
          </span>
        </motion.div>
      )}

      <div className="betting-panels">
        {/* Left Betting Panel */}
        <motion.div
          className="betting-panel"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="bet-auto-toggle">
            <button
              className={`toggle-btn ${!isAutoBet ? "active" : ""}`}
              onClick={() => onToggleAutoBet()}
              disabled={gamePhase !== "betting"}
            >
              🎯 Bet
            </button>
            <button
              className={`toggle-btn ${isAutoBet ? "active" : ""}`}
              onClick={() => onToggleAutoBet()}
              disabled={gamePhase !== "betting"}
            >
              🤖 Auto
            </button>
          </div>

          <div className="bet-amount-control">
            <button
              className="amount-btn decrement"
              onClick={handleDecrement}
              disabled={!canBet || gamePhase !== "betting"}
            >
              ➖
            </button>
            <input
              type="number"
              value={betAmount.toFixed(2)}
              onChange={handleBetAmountChange}
              className="bet-input"
              disabled={!canBet || gamePhase !== "betting"}
              min="1"
              max={balance}
            />
            <button
              className="amount-btn increment"
              onClick={handleIncrement}
              disabled={
                !canBet || betAmount >= balance || gamePhase !== "betting"
              }
            >
              ➕
            </button>
          </div>

          <div className="quick-bet-options">
            {quickBetOptions.map((amount) => (
              <button
                key={amount}
                className="quick-bet-btn"
                onClick={() => handleQuickBet(amount)}
                disabled={
                  !canBet || amount > balance || gamePhase !== "betting"
                }
              >
                💰 {amount.toLocaleString()}
              </button>
            ))}
          </div>

          <motion.button
            className={`place-bet-btn ${
              canBet && gamePhase === "betting" && !hasPlacedBet
                ? "active"
                : "disabled"
            }`}
            onClick={onPlaceBet}
            disabled={
              !canBet ||
              balance < betAmount ||
              gamePhase !== "betting" ||
              hasPlacedBet
            }
            whileHover={
              canBet && gamePhase === "betting" && !hasPlacedBet
                ? { scale: 1.02 }
                : {}
            }
            whileTap={
              canBet && gamePhase === "betting" && !hasPlacedBet
                ? { scale: 0.98 }
                : {}
            }
          >
            <span className="bet-text">
              {hasPlacedBet ? "✅ Bet Placed!" : "🎲 Place Bet"}
            </span>
            <span className="bet-amount">{betAmount.toFixed(2)} BDT</span>
          </motion.button>
        </motion.div>

        {/* Right Betting Panel */}
        <motion.div
          className="betting-panel"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="bet-auto-toggle">
            <button
              className={`toggle-btn ${!isAutoBet ? "active" : ""}`}
              onClick={() => onToggleAutoBet()}
              disabled={gamePhase !== "betting"}
            >
              🎯 Bet
            </button>
            <button
              className={`toggle-btn ${isAutoBet ? "active" : ""}`}
              onClick={() => onToggleAutoBet()}
              disabled={gamePhase !== "betting"}
            >
              🤖 Auto
            </button>
          </div>

          <div className="bet-amount-control">
            <button
              className="amount-btn decrement"
              onClick={handleDecrement}
              disabled={!canBet || gamePhase !== "betting"}
            >
              ➖
            </button>
            <input
              type="number"
              value={betAmount.toFixed(2)}
              onChange={handleBetAmountChange}
              className="bet-input"
              disabled={!canBet || gamePhase !== "betting"}
              min="1"
              max={balance}
            />
            <button
              className="amount-btn increment"
              onClick={handleIncrement}
              disabled={
                !canBet || betAmount >= balance || gamePhase !== "betting"
              }
            >
              ➕
            </button>
          </div>

          <div className="quick-bet-options">
            {quickBetOptions.map((amount) => (
              <button
                key={amount}
                className="quick-bet-btn"
                onClick={() => handleQuickBet(amount)}
                disabled={
                  !canBet || amount > balance || gamePhase !== "betting"
                }
              >
                💰 {amount.toLocaleString()}
              </button>
            ))}
          </div>

          <motion.button
            className={`place-bet-btn ${
              canBet && gamePhase === "betting" && !hasPlacedBet
                ? "active"
                : "disabled"
            }`}
            onClick={onPlaceBet}
            disabled={
              !canBet ||
              balance < betAmount ||
              gamePhase !== "betting" ||
              hasPlacedBet
            }
            whileHover={
              canBet && gamePhase === "betting" && !hasPlacedBet
                ? { scale: 1.02 }
                : {}
            }
            whileTap={
              canBet && gamePhase === "betting" && !hasPlacedBet
                ? { scale: 0.98 }
                : {}
            }
          >
            <span className="bet-text">
              {hasPlacedBet ? "✅ Bet Placed!" : "🎲 Place Bet"}
            </span>
            <span className="bet-amount">{betAmount.toFixed(2)} BDT</span>
          </motion.button>

          <div className="history-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
        </motion.div>

        {/* Cash Out Button */}
        {gamePhase === "flying" && hasPlacedBet && !isCrashed && (
          <motion.div
            className="cash-out-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.button
              className="cash-out-btn"
              onClick={onCashOut}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 8px 25px rgba(245, 158, 11, 0.4)",
                  "0 12px 35px rgba(245, 158, 11, 0.6)",
                  "0 8px 25px rgba(245, 158, 11, 0.4)",
                ],
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              💰 Cash Out at {currentMultiplier.toFixed(2)}x
            </motion.button>
          </motion.div>
        )}

        {/* Game Status Message */}
        {gameMessage && (
          <motion.div
            className="game-status-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="status-text">{gameMessage}</span>
          </motion.div>
        )}

        {/* Game Result */}
        {showResult && (
          <motion.div
            className={`game-result ${gameResult}`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="result-message">{gameMessage}</div>
            <motion.button
              className="continue-btn"
              onClick={onContinue}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              🔄 Continue
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
