import React, { useRef, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

const CanvasBackground = () => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particlesArray = [];
    const numberOfParticles = 35;
    // Use the theme's primary color (green)
    const orbColor =
      theme.palette.mode === "dark"
        ? theme.palette.primary.light // Brighter green in dark mode
        : theme.palette.primary.main; // Regular green in light mode

    // Set the canvas size to the window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor(x, y, size, color, weight) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.weight = weight;
        this.directionX = Math.random() * 2 - 1;
        this.directionY = Math.random() * 2 - 1;
        // Increased base opacity for better visibility
        this.alpha = Math.random() * 0.4 + 0.4; // Random opacity between 0.4 and 0.8
      }

      draw() {
        ctx.save(); // Save the current state
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);

        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          0,
          this.x,
          this.y,
          this.size * 2
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        // Fill with solid color
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();

        // Add outer glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2, false);
        ctx.fillStyle = gradient;
        ctx.globalAlpha = this.alpha * 0.5;
        ctx.fill();

        ctx.restore(); // Restore to previous state
      }

      update() {
        this.x += this.directionX * 0.5; // Slowed down movement
        this.y += this.directionY * 0.5; // Slowed down movement

        // Bounce particles off the edges with some padding
        const padding = this.size * 2;
        if (this.x < padding || this.x > canvas.width - padding) {
          this.directionX *= -1;
        }
        if (this.y < padding || this.y > canvas.height - padding) {
          this.directionY *= -1;
        }

        // Keep particles within bounds
        this.x = Math.max(padding, Math.min(canvas.width - padding, this.x));
        this.y = Math.max(padding, Math.min(canvas.height - padding, this.y));
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * (canvas.width - 40) + 20; // More padding
        let y = Math.random() * (canvas.height - 40) + 20; // More padding
        let size = Math.random() * 6 + 6; // Adjusted size range: 6-12px
        let color = orbColor;
        particlesArray.push(new Particle(x, y, size, color));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      animationFrameId.current = requestAnimationFrame(animate);
    }

    init();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("resize", handleResize);

    // Clean up the animation frame and event listener on unmount
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [
    theme.palette.primary.main,
    theme.palette.primary.light,
    theme.palette.mode,
  ]); // Re-run effect when theme changes

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
};

export default CanvasBackground;
