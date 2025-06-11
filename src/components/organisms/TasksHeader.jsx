import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TasksHeader = ({ onAddTask }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-2xl font-heading font-bold text-surface-900">Tasks</h1>
        <p className="text-surface-600">Manage and organize your tasks</p>
      </div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onAddTask}
          className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors flex items-center space-x-2 shadow-sm"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Task</span>
        </Button>
      </motion.div>
    </div>
  );
};

export default TasksHeader;