import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ 
            rotateY: [0, 360],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="mb-6"
        >
          <ApperIcon name="FileQuestion" size={64} className="text-surface-300 mx-auto" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-bold text-surface-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-surface-700 mb-4">Page Not Found</h2>
        <p className="text-surface-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
            <Button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors shadow-sm"
            >
              Go to Dashboard
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full">
            <Button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 bg-surface-100 text-surface-700 rounded-button hover:bg-surface-200 transition-colors"
            >
              Go Back
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;