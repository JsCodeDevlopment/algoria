"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const [beams, setBeams] = useState<{
    id: number;
    x: number;
    y: number;
    angle: number;
    delay: number;
    duration: number;
    width: number;
  }[]>([]);

  useEffect(() => {
    const generateBeams = () => {
      const newBeams = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        angle: Math.random() * 360,
        delay: Math.random() * 10,
        duration: 8 + Math.random() * 12,
        width: 100 + Math.random() * 300,
      }));
      setBeams(newBeams);
    };

    generateBeams();
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]",
        className
      )}
    >
      <svg
        className="absolute h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="beam-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {beams.map((beam) => (
          <motion.rect
            key={beam.id}
            x={`${beam.x}%`}
            y={`${beam.y}%`}
            width={beam.width}
            height="1"
            fill="url(#beam-gradient)"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scaleX: [0, 1, 0],
              translateX: ["-50%", "50%"],
            }}
            transition={{
              duration: beam.duration,
              repeat: Infinity,
              delay: beam.delay,
              ease: "easeInOut",
            }}
            style={{
              rotate: `${beam.angle}deg`,
              transformOrigin: "center center",
            }}
          />
        ))}
      </svg>
    </div>
  );
};
