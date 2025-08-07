import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import airplaneImage from "../../assets/aroplan.png";

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

export default function FlightCanvas({
  planePosition,
  flightPath,
  targetScore,
}: FlightCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw flight path and curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background curve (theoretical path)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.5);

    for (let x = 0; x < canvas.width; x += 3) {
      const progress = x / canvas.width;
      const y = canvas.height * 0.5 + Math.sin(progress * Math.PI * 3) * 100;
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw flight path trail (actual path taken)
    if (flightPath.length > 1) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 3;
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

      // Add dots along the flight path for better visualization
      flightPath.forEach((point, index) => {
        if (index % 10 === 0) {
          // Add dot every 10 points
          const x = (point.x / 100) * canvas.width;
          const y = (point.y / 100) * canvas.height;

          ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    }

    // Draw current position indicator with larger, more visible dot
    if (planePosition.x > 0) {
      const x = (planePosition.x / 100) * canvas.width;
      const y = (planePosition.y / 100) * canvas.height;

      // Outer glow
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, 2 * Math.PI);
      ctx.fill();

      // Inner dot
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
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

      {/* Airplane with image */}
      <motion.div
        className="airplane"
        style={{
          left: `${planePosition.x}%`,
          top: `${planePosition.y}%`,
          transform: `rotate(${planePosition.angle}deg)`,
        }}
        animate={{
          y: [0, -3, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.1 }}
      >
        <img
          src={airplaneImage}
          alt="Airplane"
          style={{
            width: "40px",
            height: "40px",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        />
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

      {/* Curve Legend */}
      <motion.div
        className="curve-legend"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          fontSize: "12px",
          color: "rgba(255, 255, 255, 0.8)",
          display: "flex",
          gap: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div
            style={{
              width: "20px",
              height: "3px",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            }}
          ></div>
          <span>Theoretical Path</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <div
            style={{
              width: "20px",
              height: "3px",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            }}
          ></div>
          <span>Actual Flight Path</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
