import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TaskItem from '@/components/molecules/TaskItem';

const TodaysTasksList = ({ upcomingTasks, onTaskToggle, getPriorityColor }) => {
  const getProjectColor = (projectId) => { /* Placeholder for DashboardPage */ return '#64748B'; };
  const getProjectName = (projectId) => { /* Placeholder for DashboardPage */ return 'Unknown'; };
  const isOverdue = (deadline, completed) => !completed && new Date(deadline) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-card p-6 shadow-card"
    >
      <h3 className="text-lg font-semibold text-surface-900 mb-4">Due Today</h3>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {upcomingTasks.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Calendar" size={32} className="text-surface-300 mx-auto mb-2" />
            <p className="text-surface-500">No tasks due today</p>
          </div>
        ) : (
          upcomingTasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onTaskToggle}
              getPriorityColor={getPriorityColor}
              getProjectColor={getProjectColor} // Pass helper from page
              getProjectName={getProjectName}   // Pass helper from page
              isOverdue={isOverdue}            // Pass helper from page
              index={index}
              isFromDashboard={true} // Flag to hide edit/delete buttons
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default TodaysTasksList;