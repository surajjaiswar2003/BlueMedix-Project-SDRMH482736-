
import React, { useEffect, useRef } from "react";

interface AnimatedGradientProps {
  className?: string;
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Animation parameters
    const circles: any[] = [];
    const colors = ["#4CAF50", "#A5D6A7", "#2196F3", "#90CAF9"];
    const circleCount = 15;

    // Create initial circles
    for (let i = 0; i < circleCount; i++) {
      circles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 60 + 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.2 + 0.1,
        speed: Math.random() * 0.3 + 0.1,
        direction: Math.random() * Math.PI * 2
      });
    }

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return;
      
      // Clear canvas with slight fade for trail effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update circles
      circles.forEach(circle => {
        // Move circle
        circle.x += Math.cos(circle.direction) * circle.speed;
        circle.y += Math.sin(circle.direction) * circle.speed;

        // Bounce off edges
        if (circle.x < 0 || circle.x > canvas.width) {
          circle.direction = Math.PI - circle.direction;
        }
        if (circle.y < 0 || circle.y > canvas.height) {
          circle.direction = -circle.direction;
        }

        // Draw circle
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${circle.color}${Math.floor(circle.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute top-0 left-0 w-full h-full -z-10 ${className || ""}`}
    />
  );
};

export default AnimatedGradient;
