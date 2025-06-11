import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ percentage, color, className }) => {
  return (
    <div className={`w-full bg-surface-200 rounded-full h-2 ${className || ''}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.8 }}
        className="h-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

export default ProgressBar;