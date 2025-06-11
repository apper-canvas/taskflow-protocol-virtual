import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

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

const ProjectForm = ({ project, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    color: availableColors[0],
    icon: availableIcons[0]
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        color: project.color || availableColors[0],
        icon: project.icon || availableIcons[0]
      });
    } else {
      setFormData({
        name: '',
        color: availableColors[0],
        icon: availableIcons[0]
      });
    }
    setErrors({});
  }, [project]);

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

  return (
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
      <FormField
        label="Project Name *"
        name="name"
        value={formData.name}
        onChange={(val) => handleChange('name', val)}
        error={errors.name}
        placeholder="Enter project name"
      />

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
        <Button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-surface-300 text-surface-700 rounded-button hover:bg-surface-50 transition-colors"
        >
          Cancel
        </Button>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
          <Button
            type="submit"
            className="w-full px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors shadow-sm"
          >
            {project ? 'Update Project' : 'Create Project'}
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default ProjectForm;