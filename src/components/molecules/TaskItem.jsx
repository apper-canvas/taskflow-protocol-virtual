import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const TaskItem = ({ task, onToggle, onEdit, onDelete, getPriorityColor, getProjectColor, getProjectName, isOverdue, index, isFromDashboard }) => {
  const priorityColorClass = getPriorityColor(task.priority);
  const projectColorStyle = { backgroundColor: getProjectColor(task.projectId) };
  const overdueClass = isOverdue(task.deadline, task.completed) ? 'text-error' : 'text-surface-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
      className="bg-white rounded-card p-4 shadow-card cursor-pointer transition-all duration-200"
    >
      <div className="flex items-start space-x-4">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
            task.completed
              ? 'bg-success border-success text-white'
              : 'border-surface-300 hover:border-success'
          }`}
        >
          {task.completed && (
            <ApperIcon name="Check" size={12} className="animate-check" />
          )}
        </button>

<div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <h3 className={`font-semibold break-words ${
                task.completed ? 'line-through text-surface-500' : 'text-surface-900'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm mt-1 break-words ${
                  task.completed ? 'text-surface-400' : 'text-surface-600'
                }`}>
                  {task.description}
                </p>
              )}
              
              {/* Notes and Subtasks indicators */}
              {((task.notes && task.notes.length > 0) || (task.subtasks && task.subtasks.length > 0)) && (
                <div className="flex items-center space-x-3 mt-2">
                  {task.notes && task.notes.length > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-surface-500">
                      <ApperIcon name="FileText" size={12} />
                      <span>{task.notes.length} note{task.notes.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-surface-500">
                      <ApperIcon name="CheckSquare" size={12} />
                      <span>
                        {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isFromDashboard && ( // Only show edit/delete buttons if not on dashboard
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => onEdit(task)}
                  className="p-1 text-surface-400 hover:text-primary transition-colors"
                >
                  <ApperIcon name="Edit" size={16} />
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="p-1 text-surface-400 hover:text-error transition-colors"
                >
                  <ApperIcon name="Trash2" size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <span 
              className="text-xs px-2 py-1 rounded-full text-white"
              style={projectColorStyle}
            >
              {getProjectName(task.projectId)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full border ${priorityColorClass}`}>
              {task.priority}
            </span>
            <div className={`flex items-center space-x-1 text-xs ${overdueClass}`}>
              <ApperIcon name="Calendar" size={12} />
              <span>
                {new Date(task.deadline).toLocaleDateString([], { month: 'short', day: '2-digit', year: 'numeric' })}
              </span>
              {isOverdue(task.deadline, task.completed) && (
                <span className="text-error font-medium">(Overdue)</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;