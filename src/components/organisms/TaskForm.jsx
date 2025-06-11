import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';

const TaskForm = ({ task, onSave, onClose, projects }) => {
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
        projectId: task.projectId || (projects.length > 0 ? projects[0].id : ''),
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
  }, [task, projects]);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <FormField
        label="Title *"
        name="title"
        value={formData.title}
        onChange={(val) => handleChange('title', val)}
        error={errors.title}
        placeholder="Enter task title"
      />

      {/* Description */}
      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={(val) => handleChange('description', val)}
        placeholder="Enter task description (optional)"
      />

      {/* Project */}
      <FormField
        label="Project *"
        name="projectId"
        type="select"
        value={formData.projectId}
        onChange={(val) => handleChange('projectId', val)}
        error={errors.projectId}
      >
        <option value="">Select a project</option>
        {projects.map(project => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </FormField>

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
      <FormField
        label="Deadline *"
        name="deadline"
        type="datetime-local"
        value={formData.deadline}
        onChange={(val) => handleChange('deadline', val)}
        error={errors.deadline}
      />

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
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </motion.div>
      </div>
    </form>
  );
};

export default TaskForm;