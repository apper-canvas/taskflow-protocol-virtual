import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

const ProjectModal = ({ isOpen, onClose, onSave, project }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: '#4F46E5',
    icon: 'Folder'
  });
  const [errors, setErrors] = useState({});

  const availableColors = [
    '#4F46E5', // Indigo
    '#10B981', // Emerald  
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
    '#EC4899', // Pink
    '#6366F1'  // Blue
  ];

  const availableIcons = [
    'Folder', 'Briefcase', 'User', 'ShoppingCart', 'Home', 'Heart',
    'Star', 'Target', 'Zap', 'Coffee', 'Book', 'Camera'
  ];

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        color: project.color || '#4F46E5',
        icon: project.icon || 'Folder'
      });
    } else {
      setFormData({
        name: '',
        color: '#4F46E5',
        icon: 'Folder'
      });
    }
    setErrors({});
  }, [project, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
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
                {project ? 'Edit Project' : 'Create New Project'}
              </h2>
              <button
                onClick={onClose}
                className="p-1 text-surface-400 hover:text-surface-600 transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Preview */}
              <div className="text-center">
                <div 
                  className="inline-flex items-center justify-center w-16 h-16 rounded-card mb-2"
                  style={{ backgroundColor: `${formData.color}15` }}
                >
                  <ApperIcon 
                    name={formData.icon} 
                    size={32} 
                    style={{ color: formData.color }}
                  />
                </div>
                <p className="text-sm text-surface-600">Project Preview</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                    errors.name 
                      ? 'border-error focus:ring-error' 
                      : 'border-surface-300 focus:border-primary'
                  }`}
                  placeholder="Enter project name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-error">{errors.name}</p>
                )}
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-3">
                  Project Color
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {availableColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleChange('color', color)}
                      className={`w-10 h-10 rounded-button transition-all ${
                        formData.color === color 
                          ? 'ring-2 ring-offset-2 ring-surface-400 scale-110' 
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-3">
                  Project Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {availableIcons.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => handleChange('icon', icon)}
                      className={`p-3 rounded-button transition-all ${
                        formData.icon === icon
                          ? 'bg-primary text-white'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                      }`}
                    >
                      <ApperIcon name={icon} size={20} />
                    </button>
                  ))}
                </div>
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
                  {project ? 'Update Project' : 'Create Project'}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProjectModal;