import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';

const TaskModal = ({ isOpen, onClose, onSave, task, projects }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    projectId: '',
    deadline: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        projectId: task.projectId || '',
        deadline: task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd'T'HH:mm") : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        projectId: projects.length > 0 ? projects[0].id : '',
        deadline: ''
      });
    }
    setErrors({});
  }, [task, projects, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.projectId) {
      newErrors.projectId = 'Project is required';
    }
    
    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        deadline: new Date(formData.deadline).toISOString()
      });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-card shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-semibold text-surface-900">
                {task ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-surface-400 hover:text-surface-600 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.title 
                      ? 'border-error focus:ring-error' 
                      : 'border-surface-300 focus:border-primary'
                  }`}
                  placeholder="Enter task title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-error">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-surface-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                  placeholder="Enter task description (optional)"
                />
              </div>

              {/* Project */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Project *
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => handleChange('projectId', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.projectId 
                      ? 'border-error focus:ring-error' 
                      : 'border-surface-300 focus:border-primary'
                  }`}
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {errors.projectId && (
                  <p className="mt-1 text-sm text-error">{errors.projectId}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['low', 'medium', 'high'].map(priority => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => handleChange('priority', priority)}
                      className={`py-2 px-3 rounded-button text-sm font-medium transition-all ${
                        formData.priority === priority
                          ? priority === 'high' 
                            ? 'bg-error text-white'
                            : priority === 'medium'
                            ? 'bg-warning text-white'
                            : 'bg-success text-white'
                          : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                      }`}
                    >
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Deadline *
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.deadline 
                      ? 'border-error focus:ring-error' 
                      : 'border-surface-300 focus:border-primary'
                  }`}
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-error">{errors.deadline}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-surface-300 text-surface-700 rounded-button hover:bg-surface-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors shadow-sm"
                >
                  {task ? 'Update Task' : 'Create Task'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;