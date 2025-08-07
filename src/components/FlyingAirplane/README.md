# Flying Airplane Game Component

A beautiful animated airplane guessing game built with React, TypeScript, and Framer Motion. The game is now organized into reusable components for better maintainability and reusability.

## 🏗️ Component Architecture

### Main Components
- **`FlyingAirplaneGame`**: Main game component that orchestrates all other components
- **`StartScreen`**: Welcome screen with animated title and start button
- **`GameHeader`**: Displays score, streak, and best streak information
- **`FlightCanvas`**: Handles airplane animation and curve visualization
- **`GameControls`**: Manages guessing buttons and result display
- **`GameHistory`**: Shows recent scores with animated entries

### Utilities
- **`useGameLogic`**: Custom hook that manages all game state and logic
- **`types.ts`**: Shared TypeScript interfaces

## 🎮 Game Features

### Game Mechanics
- **Curve-based Flight Path**: The airplane follows a mathematical curve (sine wave) across the screen
- **Real-time Position Tracking**: Shows the exact position of the airplane as it moves
- **Score Guessing**: Players guess if the final score will be higher or lower than the target
- **Dynamic Scoring**: +10 points for correct guesses, -5 for wrong ones
- **Streak System**: Track consecutive correct guesses and best streaks
- **Game History**: Shows recent scores with animated entries

### Visual Features
- **Smooth Animations**: All elements animate with Framer Motion
- **Flight Path Visualization**: Canvas-drawn curve shows the actual flight path
- **Position Indicator**: Real-time display of airplane coordinates
- **Glassmorphism Design**: Beautiful blur effects and transparency
- **Responsive Design**: Works perfectly on mobile and desktop
- **Interactive Elements**: Hover and tap animations for all buttons

## 📁 File Structure

```
src/components/FlyingAirplane/
├── FlyingAirplaneGame.tsx    # Main game component
├── StartScreen.tsx           # Welcome screen component
├── GameHeader.tsx            # Score display component
├── FlightCanvas.tsx          # Airplane animation component
├── GameControls.tsx          # Game controls component
├── GameHistory.tsx           # Score history component
├── useGameLogic.ts           # Custom hook for game logic
├── types.ts                  # Shared TypeScript interfaces
├── FlyingAirplaneGame.css    # Component styles
├── index.ts                  # Export file
└── README.md                 # This documentation
```

## 🚀 Usage

### Basic Usage
```tsx
import FlyingAirplaneGame from './components/FlyingAirplane';

function App() {
  return <FlyingAirplaneGame />;
}
```

### Using Individual Components
```tsx
import { 
  StartScreen, 
  GameHeader, 
  FlightCanvas, 
  GameControls, 
  GameHistory,
  useGameLogic 
} from './components/FlyingAirplane';

function CustomGame() {
  const gameLogic = useGameLogic();
  
  return (
    <div>
      <GameHeader 
        score={gameLogic.gameState.score}
        streak={gameLogic.gameState.streak}
        bestStreak={gameLogic.gameState.bestStreak}
      />
      <FlightCanvas 
        planePosition={gameLogic.planePosition}
        flightPath={gameLogic.flightPath}
        targetScore={gameLogic.targetScore}
      />
      {/* ... other components */}
    </div>
  );
}
```

### Using the Custom Hook
```tsx
import { useGameLogic } from './components/FlyingAirplane';

function CustomGame() {
  const {
    gameState,
    planePosition,
    targetScore,
    startGame,
    makeGuess,
    continueGame,
  } = useGameLogic();

  // Custom game logic here
  return <div>Your custom game UI</div>;
}
```

## 🎨 Technical Details

### Curve Calculation
The airplane follows a sine wave curve:
```typescript
const calculateCurvePosition = (time: number): PlanePosition => {
  const x = (time / 100) * 100; // Move across screen
  const y = 50 + Math.sin(time * 0.02) * 30; // Sine wave curve
  const angle = Math.cos(time * 0.02) * 15; // Angle based on curve direction
  
  return { x: Math.max(0, Math.min(100, x)), y, angle };
};
```

### Canvas Drawing
- **Background Curve**: Shows the theoretical flight path
- **Flight Trail**: Draws the actual path the airplane has taken
- **Position Indicator**: Shows current airplane location

### State Management
- **Game State**: Tracks score, streak, history, and game status
- **Plane Position**: Real-time coordinates and rotation
- **Animation State**: Controls smooth transitions and animations

## 🔧 Dependencies

- React 19.1.1
- TypeScript 5.8.3
- Framer Motion (for animations)
- CSS3 (for styling and effects)

## 🌐 Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Canvas API for flight path drawing
- CSS backdrop-filter for glassmorphism effects

## 🎯 Component Reusability

Each component is designed to be reusable:

- **`StartScreen`**: Can be used in other games with different titles and descriptions
- **`GameHeader`**: Reusable for any game that needs score display
- **`FlightCanvas`**: Can be adapted for other flying/curve-based games
- **`GameControls`**: Reusable for any guessing game
- **`GameHistory`**: Can be used for any game that tracks scores
- **`useGameLogic`**: Customizable hook for different game mechanics

## 🎨 Customization

All components accept props for customization:

```tsx
<StartScreen 
  onStartGame={customStartFunction}
  title="Custom Game Title"
  description="Custom game description"
/>

<GameHeader 
  score={customScore}
  streak={customStreak}
  bestStreak={customBestStreak}
/>

<FlightCanvas 
  planePosition={customPosition}
  flightPath={customPath}
  targetScore={customTarget}
/>
``` 