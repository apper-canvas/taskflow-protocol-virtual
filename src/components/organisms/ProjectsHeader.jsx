import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ProjectsHeader = ({ onAddProject }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-2xl font-heading font-bold text-surface-900">Projects</h1>
        <p className="text-surface-600">Organize your tasks into projects</p>
      </div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onAddProject}
          className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors flex items-center space-x-2 shadow-sm"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Project</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default ProjectsHeader;