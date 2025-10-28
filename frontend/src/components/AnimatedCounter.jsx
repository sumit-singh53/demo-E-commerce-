// Animated Counter component for cart totals with smooth number transitions
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

function AnimatedCounter({ 
  value, 
  duration = 0.8, 
  prefix = '', 
  suffix = '', 
  decimals = 2,
  className = '',
  style = {}
}) {
  const [displayValue, setDisplayValue] = useState(value);
  
  // Use Framer Motion's spring animation for smooth counting
  const spring = useSpring(value, {
    stiffness: 100,
    damping: 30,
    mass: 1
  });

  const display = useTransform(spring, (current) => {
    return `${prefix}${current.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span
      className={className}
      style={style}
      initial={{ scale: 1 }}
      animate={{ 
        scale: [1, 1.1, 1],
        transition: { 
          duration: 0.3,
          ease: "easeOut"
        }
      }}
      key={value} // Re-trigger animation when value changes
    >
      <motion.span>{display}</motion.span>
    </motion.span>
  );
}

export default AnimatedCounter;