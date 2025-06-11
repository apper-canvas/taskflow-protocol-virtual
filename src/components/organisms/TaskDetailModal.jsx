import React from 'react';
import { motion } from 'framer-motion';
import Modal from '@/components/molecules/Modal';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TaskDetailModal = ({ isOpen, onClose, task, getProjectColor, getProjectName, getPriorityColor, isOverdue }) => {
  if (!task) return null;

  const priorityColorClass = getPriorityColor(task.priority);
  const projectColorStyle = { backgroundColor: getProjectColor(task.projectId) };
  const overdueClass = isOverdue(task.deadline, task.completed) ? 'text-error' : 'text-surface-600';
  const completedSubtasks = task.subtasks ? task.subtasks.filter(st => st.completed).length : 0;
  const totalSubtasks = task.subtasks ? task.subtasks.length : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Task Header */}
        <div className="flex items-start space-x-4">
          <div
            className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              task.completed
                ? 'bg-success border-success text-white'
                : 'border-surface-300'
            }`}
          >
            {task.completed && (
              <ApperIcon name="Check" size={14} />
            )}
          </div>
          <div className="flex-1">
            <h2 className={`text-xl font-semibold ${
              task.completed ? 'line-through text-surface-500' : 'text-surface-900'
            }`}>
              {task.title}
            </h2>
            {task.description && (
              <p className={`mt-2 ${
                task.completed ? 'text-surface-400' : 'text-surface-600'
              }`}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Task Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-surface-50 rounded-lg">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-surface-700">Project</label>
              <div className="mt-1">
                <span 
                  className="inline-block text-sm px-3 py-1 rounded-full text-white"
                  style={projectColorStyle}
                >
                  {getProjectName(task.projectId)}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700">Priority</label>
              <div className="mt-1">
                <span className={`inline-block text-sm px-3 py-1 rounded-full border ${priorityColorClass}`}>
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-surface-700">Deadline</label>
              <div className={`mt-1 flex items-center space-x-2 text-sm ${overdueClass}`}>
                <ApperIcon name="Calendar" size={16} />
                <span>
                  {new Date(task.deadline).toLocaleDateString([], { 
                    weekday: 'long',
                    month: 'long', 
                    day: '2-digit', 
                    year: 'numeric' 
                  })}
                </span>
                {isOverdue(task.deadline, task.completed) && (
                  <span className="text-error font-medium">(Overdue)</span>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-surface-700">Status</label>
              <div className="mt-1">
                <span className={`inline-block text-sm px-3 py-1 rounded-full ${
                  task.completed 
                    ? 'bg-success text-white' 
                    : isOverdue(task.deadline, task.completed)
                    ? 'bg-error text-white'
                    : 'bg-warning text-white'
                }`}>
                  {task.completed ? 'Completed' : isOverdue(task.deadline, task.completed) ? 'Overdue' : 'In Progress'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        {task.notes && task.notes.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <ApperIcon name="FileText" size={20} className="text-surface-600" />
              <h3 className="text-lg font-semibold text-surface-900">Notes</h3>
              <span className="text-sm text-surface-500">({task.notes.length})</span>
            </div>
            <div className="space-y-3">
              {task.notes.map((note, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-white border border-surface-200 rounded-lg"
                >
                  <p className="text-surface-700">{note.content}</p>
                  <p className="text-xs text-surface-500 mt-2">
                    {new Date(note.createdAt).toLocaleDateString([], {
                      month: 'short',
                      day: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Subtasks Section */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <ApperIcon name="CheckSquare" size={20} className="text-surface-600" />
              <h3 className="text-lg font-semibold text-surface-900">Subtasks</h3>
              <span className="text-sm text-surface-500">({completedSubtasks}/{totalSubtasks} completed)</span>
            </div>
            <div className="space-y-2">
              {task.subtasks.map((subtask, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-white border border-surface-200 rounded-lg"
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      subtask.completed
                        ? 'bg-success border-success text-white'
                        : 'border-surface-300'
                    }`}
                  >
                    {subtask.completed && (
                      <ApperIcon name="Check" size={10} />
                    )}
                  </div>
                  <span className={`${
                    subtask.completed ? 'line-through text-surface-500' : 'text-surface-700'
                  }`}>
                    {subtask.title}
                  </span>
                </motion.div>
              ))}
            </div>
            {completedSubtasks > 0 && (
              <div className="mt-3 bg-surface-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm text-surface-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round((completedSubtasks / totalSubtasks) * 100)}%</span>
                </div>
                <div className="w-full bg-surface-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-success h-2 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-surface-200">
          <Button
            onClick={onClose}
            variant="secondary"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;