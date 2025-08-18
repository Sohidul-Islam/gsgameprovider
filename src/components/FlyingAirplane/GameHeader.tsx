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
    <div className="game-header">
      <div className="score-info">
        <div className="score-item balance-item">
          <div className="item-icon">💰</div>
          <div className="item-content">
            <span className="label">Balance</span>
            <span className="value balance-value">
              {balance.toFixed(2)}
              <span className="currency">BDT</span>
            </span>
          </div>
        </div>

        <div className="score-item bet-item">
          <div className="item-icon">🎯</div>
          <div className="item-content">
            <span className="label">Bet Amount</span>
            <span className="value bet-value">
              {betAmount.toFixed(2)}
              <span className="currency">BDT</span>
            </span>
          </div>
        </div>

        <div className="score-item multiplier-item">
          <div className="item-icon">⚡</div>
          <div className="item-content">
            <span className="label">Multiplier</span>
            <span className="value multiplier-value">
              {currentMultiplier.toFixed(2)}x
            </span>
          </div>
        </div>

        <div className="score-item players-item">
          <div className="item-icon">👥</div>
          <div className="item-content">
            <span className="label">Players</span>
            <span className="value players-value">
              {playerCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
