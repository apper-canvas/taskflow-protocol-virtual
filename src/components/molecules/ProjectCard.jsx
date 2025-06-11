import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/molecules/ProgressBar'; // Assuming this is created

const ProjectCard = ({ project, projectTasks, onEdit, onDelete, onToggleExpand, isExpanded, index }) => {
  const taskCount = projectTasks.length;
  const completedTasks = projectTasks.filter(task => task.completed).length;
  const completionPercentage = taskCount === 0 ? 0 : Math.round((completedTasks / taskCount) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' 
      }}
      className="bg-white rounded-card shadow-card overflow-hidden cursor-pointer transition-all duration-200"
      onClick={onToggleExpand}
    >
      <div 
        className="h-3"
        style={{ backgroundColor: project.color }}
      />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-button"
              style={{ backgroundColor: `${project.color}15` }}
            >
              <ApperIcon 
                name={project.icon} 
                size={20} 
                style={{ color: project.color }}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-surface-900">{project.name}</h3>
              <p className="text-sm text-surface-600">{taskCount} tasks</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="p-1 text-surface-400 hover:text-primary transition-colors"
            >
              <ApperIcon name="Edit" size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="p-1 text-surface-400 hover:text-error transition-colors"
            >
              <ApperIcon name="Trash2" size={16} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-surface-600">Progress</span>
            <span className="font-medium text-surface-900">
              {completionPercentage}%
            </span>
          </div>
          <ProgressBar percentage={completionPercentage} color={project.color} transitionDelay={index * 0.1 + 0.3} />
        </div>

        {/* Task Stats */}
        <div className="flex items-center justify-between text-sm text-surface-600">
          <span>{completedTasks} completed</span>
          <span>{taskCount - completedTasks} pending</span>
        </div>

        {/* Expanded Task List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-surface-200"
            >
              <h4 className="text-sm font-medium text-surface-900 mb-3">Recent Tasks</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {projectTasks.length === 0 ? (
                    <p className="text-xs text-surface-500">No tasks in this project yet.</p>
                ) : (
                    projectTasks.slice(0, 5).map(task => (
                    <div key={task.id} className="flex items-center space-x-2 text-sm">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        task.completed ? 'bg-success' : 'bg-surface-300'
                        }`} />
                        <span className={`break-words ${
                        task.completed ? 'line-through text-surface-500' : 'text-surface-700'
                        }`}>
                        {task.title}
                        </span>
                    </div>
                    ))
                )}
                {projectTasks.length > 5 && (
                  <p className="text-xs text-surface-500">
                    +{projectTasks.length - 5} more tasks
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ProjectCard;