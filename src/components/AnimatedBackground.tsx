import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export const AnimatedBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    // Generate particles
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const particleCount = window.innerWidth < 768 ? 15 : 25; // Fewer particles on mobile

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 10 + 8,
          delay: Math.random() * 5,
        });
      }
      particles.current = newParticles;
    };

    generateParticles();

    // Regenerate particles on window resize
    const handleResize = () => {
      generateParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ zIndex: -1 }}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 opacity-90" />
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-gradient-x" />
      
      {/* Floating Particles */}
      {particles.current.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20 dark:bg-white/10"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Geometric Shapes */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/10 rounded-full"
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <motion.div
        className="absolute top-3/4 right-1/4 w-24 h-24 border border-white/10 rounded-lg"
        animate={{
          rotate: -360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Glowing Orbs */}
      <motion.div
        className="absolute top-1/3 right-1/3 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};
