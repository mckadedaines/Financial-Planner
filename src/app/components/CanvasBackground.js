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
    const orbColor = theme.palette.text.primary;

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
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.6; // Add some transparency
        ctx.filter = "blur(2px)"; // Add blur effect
        ctx.fill();
        ctx.filter = "none"; // Reset filter
        ctx.globalAlpha = 1; // Reset transparency
      }

      update() {
        this.x += this.directionX;
        this.y += this.directionY;

        // Bounce particles off the edges
        if (this.x < 0 || this.x > canvas.width) {
          this.directionX *= -1;
        }
        if (this.y < 0 || this.y > canvas.height) {
          this.directionY *= -1;
        }
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        let size = Math.random() * 10 + 5;
        let color = orbColor;
        particlesArray.push(new Particle(x, y, size, color));
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas instead of filling with background color

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
  }, []);

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
