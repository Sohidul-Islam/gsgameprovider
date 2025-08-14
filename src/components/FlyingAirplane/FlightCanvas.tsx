import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { PlanePosition } from "./types";
import airplaneImage from "../../assets/aroplan.png";
import "./FlyingAirplaneGame.css";

interface FlightCanvasProps {
  planePosition: PlanePosition;
  flightPath: { x: number; y: number }[];
  currentMultiplier: number;
  playerCount: number;
  isCrashed: boolean;
  gamePhase: "betting" | "flying" | "crashed";
}

export default function FlightCanvas({
  planePosition,
  flightPath,
  currentMultiplier,
  playerCount,
  isCrashed,
  gamePhase,
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create radial gradient background
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    gradient.addColorStop(0, "rgba(255, 68, 68, 0.1)");
    gradient.addColorStop(0.5, "rgba(255, 68, 68, 0.05)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw radial rays
    ctx.strokeStyle = "rgba(255, 68, 68, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const x1 = canvas.width / 2;
      const y1 = canvas.height / 2;
      const x2 = x1 + Math.cos(angle) * canvas.width;
      const y2 = y1 + Math.sin(angle) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    // Draw flight path
    if (flightPath.length > 1) {
      ctx.strokeStyle = "#ff4444";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      // Create gradient for flight path
      const pathGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      pathGradient.addColorStop(0, "#ff4444");
      pathGradient.addColorStop(0.5, "#ff6666");
      pathGradient.addColorStop(1, "#ff8888");
      ctx.strokeStyle = pathGradient;

      ctx.beginPath();
      ctx.moveTo(
        (flightPath[0].x / 100) * canvas.width,
        (flightPath[0].y / 100) * canvas.height
      );

      for (let i = 1; i < flightPath.length; i++) {
        ctx.lineTo(
          (flightPath[i].x / 100) * canvas.width,
          (flightPath[i].y / 100) * canvas.height
        );
      }
      ctx.stroke();

      // Fill area under flight path
      ctx.fillStyle = "rgba(255, 68, 68, 0.1)";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(
        (flightPath[0].x / 100) * canvas.width,
        (flightPath[0].y / 100) * canvas.height
      );

      for (let i = 1; i < flightPath.length; i++) {
        ctx.lineTo(
          (flightPath[i].x / 100) * canvas.width,
          (flightPath[i].y / 100) * canvas.height
        );
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();
    }

    // Draw airplane image only during flying phase and if not crashed
    if (airplaneImgRef.current && gamePhase === "flying" && !isCrashed) {
      const img = airplaneImgRef.current;
      const imgSize = 80;

      const x = (planePosition.x / 100) * canvas.width;
      const y = (planePosition.y / 100) * canvas.height;

      // Save context state
      ctx.save();

      // Move to airplane position and rotate
      ctx.translate(x, y);
      // ctx.rotate((planePosition.angle * Math.PI) / 180);

      // Add glow effect
      // ctx.shadowColor = "#ff4444";
      // ctx.shadowBlur = 20;

      // Draw airplane image centered at position
      ctx.drawImage(img, -imgSize / 2, -imgSize / 2, imgSize, imgSize);

      // Restore context state
      ctx.restore();
      ctx.shadowBlur = 0;
    }

    // // Draw crash effect
    // if (isCrashed) {
    //   const centerX = canvas.width / 2;
    //   const centerY = canvas.height / 2;

    //   // Explosion effect
    //   for (let i = 0; i < 20; i++) {
    //     const angle = (i * Math.PI * 2) / 20;
    //     const distance = 50 + Math.random() * 30;
    //     const x = centerX + Math.cos(angle) * distance;
    //     const y = centerY + Math.sin(angle) * distance;

    //     ctx.fillStyle = `rgba(255, ${68 + Math.random() * 100}, ${
    //       68 + Math.random() * 100
    //     }, ${0.8 + Math.random() * 0.2})`;
    //     ctx.beginPath();
    //     ctx.arc(x, y, 3 + Math.random() * 5, 0, Math.PI * 2);
    //     ctx.fill();
    //   }
    // }
  }, [planePosition, flightPath, gamePhase, isCrashed]);

  return (
    <div className="flight-container">
      <canvas
        ref={canvasRef}
        className="flight-canvas"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Multiplier Display */}
      <motion.div
        className="multiplier-display"
        animate={{
          scale: gamePhase === "flying" ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: gamePhase === "flying" ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <span className="multiplier-value">
          {gamePhase === "betting"
            ? "WAITING"
            : (currentMultiplier || 0)?.toFixed(2) + "x"}
        </span>
      </motion.div>

      {/* Player Count */}
      <div className="player-count">
        <span className="player-icon">👥</span>
        <span className="player-number">{playerCount.toLocaleString()}</span>
      </div>

      {/* Betting Phase Message */}
      {gamePhase === "betting" && (
        <div className="betting-phase-message">
          <span className="phase-text">🎲 Place your bets!</span>
        </div>
      )}

      {/* Crash Message */}
      {isCrashed && (
        <motion.div
          className="crash-message"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          💥 CRASHED!
        </motion.div>
      )}
    </div>
  );
}
