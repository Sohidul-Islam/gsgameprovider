import React from "react";
import "./GameControls.css";

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
}: GameControlsProps) {
  const quickBetOptions = [100, 200, 500, 10000];

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

  return (
    <div className="betting-panels">
      {/* Left Betting Panel */}
      <div className="betting-panel">
        <div className="bet-auto-toggle">
          <button
            className={`toggle-btn ${!isAutoBet ? "active" : ""}`}
            onClick={() => onToggleAutoBet()}
          >
            Bet
          </button>
          <button
            className={`toggle-btn ${isAutoBet ? "active" : ""}`}
            onClick={() => onToggleAutoBet()}
          >
            Auto
          </button>
        </div>

        <div className="bet-amount-control">
          <button
            className="amount-btn decrement"
            onClick={handleDecrement}
            disabled={!canBet}
          >
            -
          </button>
          <input
            type="number"
            value={betAmount.toFixed(2)}
            onChange={handleBetAmountChange}
            className="bet-input"
            disabled={!canBet}
            min="1"
            max={balance}
          />
          <button
            className="amount-btn increment"
            onClick={handleIncrement}
            disabled={!canBet || betAmount >= balance}
          >
            +
          </button>
        </div>

        <div className="quick-bet-options">
          {quickBetOptions.map((amount) => (
            <button
              key={amount}
              className="quick-bet-btn"
              onClick={() => handleQuickBet(amount)}
              disabled={!canBet || amount > balance}
            >
              {amount.toLocaleString()}
            </button>
          ))}
        </div>

        <button
          className={`place-bet-btn ${canBet ? "active" : "disabled"}`}
          onClick={onPlaceBet}
          disabled={!canBet || balance < betAmount}
        >
          <span className="bet-text">Bet</span>
          <span className="bet-amount">{betAmount.toFixed(2)} BDT</span>
        </button>
      </div>

      {/* Right Betting Panel */}
      <div className="betting-panel">
        <div className="bet-auto-toggle">
          <button
            className={`toggle-btn ${!isAutoBet ? "active" : ""}`}
            onClick={() => onToggleAutoBet()}
          >
            Bet
          </button>
          <button
            className={`toggle-btn ${isAutoBet ? "active" : ""}`}
            onClick={() => onToggleAutoBet()}
          >
            Auto
          </button>
        </div>

        <div className="bet-amount-control">
          <button
            className="amount-btn decrement"
            onClick={handleDecrement}
            disabled={!canBet}
          >
            -
          </button>
          <input
            type="number"
            value={betAmount.toFixed(2)}
            onChange={handleBetAmountChange}
            className="bet-input"
            disabled={!canBet}
            min="1"
            max={balance}
          />
          <button
            className="amount-btn increment"
            onClick={handleIncrement}
            disabled={!canBet || betAmount >= balance}
          >
            +
          </button>
        </div>

        <div className="quick-bet-options">
          {quickBetOptions.map((amount) => (
            <button
              key={amount}
              className="quick-bet-btn"
              onClick={() => handleQuickBet(amount)}
              disabled={!canBet || amount > balance}
            >
              {amount.toLocaleString()}
            </button>
          ))}
        </div>

        <button
          className={`place-bet-btn ${canBet ? "active" : "disabled"}`}
          onClick={onPlaceBet}
          disabled={!canBet || balance < betAmount}
        >
          <span className="bet-text">Bet</span>
          <span className="bet-amount">{betAmount.toFixed(2)} BDT</span>
        </button>

        <div className="history-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
      </div>

      {/* Cash Out Button */}
      {isPlaying && !canBet && !isCrashed && (
        <div className="cash-out-container">
          <button className="cash-out-btn" onClick={onCashOut}>
            Cash Out at {currentMultiplier.toFixed(2)}x
          </button>
        </div>
      )}

      {/* Game Result */}
      {showResult && (
        <div className={`game-result ${gameResult}`}>
          <div className="result-message">{gameMessage}</div>
          <button className="continue-btn" onClick={onContinue}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
