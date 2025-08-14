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
  currentMultiplier: number;
  playerCount: number;
  isCrashed: boolean;
}

export default function FlightCanvas({
  planePosition,
  flightPath,
  currentMultiplier,
  playerCount,
  isCrashed,
}: FlightCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const airplaneImgRef = useRef<HTMLImageElement>(null);

  // Preload airplane image
  useEffect(() => {
    const img = new Image();
    img.src = airplaneImage;
    img.onload = () => {
      airplaneImgRef.current = img;
    };
  }, []);

  // Draw flight path and curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create radial gradient background
    const gradient = ctx.createRadialGradient(
      canvas.width * 0.2,
      canvas.height * 0.8,
      0,
      canvas.width * 0.5,
      canvas.height * 0.5,
      canvas.width * 0.8
    );
    gradient.addColorStop(0, "#000000");
    gradient.addColorStop(0.3, "#0a0a0a");
    gradient.addColorStop(0.7, "#1a1a2e");
    gradient.addColorStop(1, "#16213e");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw radial rays from bottom left
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const angle = (i * Math.PI) / 40;
      const x1 = 0;
      const y1 = canvas.height;
      const x2 = canvas.width * Math.cos(angle);
      const y2 = canvas.height - canvas.height * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw red graph line (crash curve)
    if (flightPath.length > 1) {
      // Create gradient for the line
      const lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      lineGradient.addColorStop(0, "#ff4444");
      lineGradient.addColorStop(1, "#ff6666");

      ctx.strokeStyle = lineGradient;
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
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

      // Fill area under the curve
      ctx.fillStyle = "rgba(255, 68, 68, 0.2)";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      flightPath.forEach((point) => {
        const x = (point.x / 100) * canvas.width;
        const y = (point.y / 100) * canvas.height;
        ctx.lineTo(x, y);
      });

      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();
    }

    // Draw airplane image at the current position
    if (airplaneImgRef.current && !isCrashed) {
      const img = airplaneImgRef.current;
      const imgSize = 80;

      const x = (planePosition.x / 100) * canvas.width;
      const y = (planePosition.y / 100) * canvas.height;

      // Save context state
      ctx.save();

      // Move to airplane position and rotate
      ctx.translate(x, y);
      ctx.rotate((planePosition.angle * Math.PI) / 180);

      // Add glow effect
      ctx.shadowColor = "#ff4444";
      ctx.shadowBlur = 20;

      // Draw airplane image centered at position
      ctx.drawImage(img, -imgSize / 2, -imgSize / 2, imgSize, imgSize);

      // Restore context state
      ctx.restore();
    }

    // Draw crash effect
    if (isCrashed) {
      const x = (planePosition.x / 100) * canvas.width;
      const y = (planePosition.y / 100) * canvas.height;

      // Explosion effect
      ctx.fillStyle = "rgba(255, 68, 68, 0.8)";
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [planePosition, flightPath, isCrashed]);

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

      {/* Multiplier Display */}
      <motion.div
        className="multiplier-display"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <span className="multiplier-value">
          {(currentMultiplier || 0)?.toFixed(2)}x
        </span>
      </motion.div>

      {/* Player Count */}
      <motion.div
        className="player-count"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="player-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <span className="player-number">{playerCount.toLocaleString()}</span>
      </motion.div>

      {/* Crash Message */}
      {isCrashed && (
        <motion.div
          className="crash-message"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          CRASHED!
        </motion.div>
      )}
    </motion.div>
  );
}
