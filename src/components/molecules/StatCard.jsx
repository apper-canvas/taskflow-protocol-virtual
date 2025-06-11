import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ title, value, icon, color, bg, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
      className="bg-white rounded-card p-6 shadow-card cursor-pointer transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-surface-600">{title}</p>
          <p className="text-3xl font-bold text-surface-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-card ${bg}`}>
          <ApperIcon name={icon} size={24} className={color} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;