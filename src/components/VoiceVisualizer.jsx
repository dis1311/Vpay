import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const VoiceVisualizer = ({ isRecording }) => {
  const bars = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="flex items-center justify-center gap-1 h-12 w-full">
      {bars.map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-indigo-500 rounded-full"
          animate={{
            height: isRecording ? [10, 30, 15, 40, 20][i % 5] : 4,
            opacity: isRecording ? 1 : 0.3,
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default VoiceVisualizer;
