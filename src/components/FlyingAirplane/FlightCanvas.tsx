import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface PlanePosition {
  x: number;
  y: number;
  angle: number;
}

interface FlightCanvasProps {
  planePosition: PlanePosition;
  flightPath: { x: number; y: number }[];
  targetScore: number;
}

export default function FlightCanvas({ planePosition, flightPath, targetScore }: FlightCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw flight path and curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background curve
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.5);

    for (let x = 0; x < canvas.width; x += 5) {
      const progress = x / canvas.width;
      const y = canvas.height * 0.5 + Math.sin(progress * Math.PI * 4) * 80;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw flight path trail
    if (flightPath.length > 1) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();

      flightPath.forEach((point, index) => {
        const x = (point.x / 100) * canvas.width;
        const y = (point.y / 100) * canvas.height;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }

    // Draw current position indicator
    if (planePosition.x > 0) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();
      const x = (planePosition.x / 100) * canvas.width;
      const y = (planePosition.y / 100) * canvas.height;
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [planePosition, flightPath]);

  return (
    <motion.div
      className="flight-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6 }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="flight-canvas"
      />

      {/* Airplane */}
      <motion.div
        className="airplane"
        style={{
          left: `${planePosition.x}%`,
          top: `${planePosition.y}%`,
          transform: `rotate(${planePosition.angle}deg)`,
        }}
        animate={{
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.2 }}
      >
        ✈️
      </motion.div>

      {/* Target Score */}
      <motion.div
        className="target-score"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Target: {targetScore}
      </motion.div>

      {/* Position Indicator */}
      <motion.div
        className="position-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Position: {Math.round(planePosition.x)}%, {Math.round(planePosition.y)}%
      </motion.div>
    </motion.div>
  );
} 