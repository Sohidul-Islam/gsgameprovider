// Main game component
export { default as FlyingAirplaneGame } from './FlyingAirplaneGame';

// Reusable components
export { default as StartScreen } from './StartScreen';
export { default as GameHeader } from './GameHeader';
export { default as FlightCanvas } from './FlightCanvas';
export { default as GameControls } from './GameControls';
export { default as GameHistory } from './GameHistory';

// Types and hooks
export * from './types';
export { useGameLogic } from './useGameLogic';

// Default export for backward compatibility
export { default } from './FlyingAirplaneGame'; 