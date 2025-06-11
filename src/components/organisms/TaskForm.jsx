import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const TaskForm = ({ task, onSave, onClose, projects }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    projectId: '',
    deadline: '',
    notes: [],
    subtasks: []
  });
  const [errors, setErrors] = useState({});
  const [showNotes, setShowNotes] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        projectId: task.projectId || (projects.length > 0 ? projects[0].id : ''),
        deadline: task.deadline ? format(new Date(task.deadline), "yyyy-MM-dd'T'HH:mm") : '',
        notes: task.notes || [],
        subtasks: task.subtasks || []
      });
      // Auto-expand sections if they have content
      setShowNotes((task.notes || []).length > 0);
      setShowSubtasks((task.subtasks || []).length > 0);
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        projectId: projects.length > 0 ? projects[0].id : '',
        deadline: '',
        notes: [],
        subtasks: []
      });
      setShowNotes(false);
      setShowSubtasks(false);
    }
    setErrors({});
    setNewNote('');
    setNewSubtask('');
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

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now().toString(),
        text: newNote.trim(),
        createdAt: new Date().toISOString()
      };
      setFormData(prev => ({
        ...prev,
        notes: [...prev.notes, note]
      }));
      setNewNote('');
    }
  };

  const deleteNote = (noteId) => {
    setFormData(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== noteId)
    }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const subtask = {
        id: Date.now().toString(),
        title: newSubtask.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, subtask]
      }));
      setNewSubtask('');
    }
  };

  const toggleSubtask = (subtaskId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(subtask =>
        subtask.id === subtaskId
          ? { ...subtask, completed: !subtask.completed }
          : subtask
      )
    }));
  };

  const deleteSubtask = (subtaskId) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(subtask => subtask.id !== subtaskId)
    }));
  };

  const completedSubtasks = formData.subtasks.filter(st => st.completed).length;
  const totalSubtasks = formData.subtasks.length;
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
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

      {/* Notes Section */}
      <div className="border-t border-surface-200 pt-4">
        <button
          type="button"
          onClick={() => setShowNotes(!showNotes)}
          className="flex items-center justify-between w-full p-3 bg-surface-50 rounded-button hover:bg-surface-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="FileText" size={16} className="text-surface-600" />
            <span className="font-medium text-surface-700">
              Notes {formData.notes.length > 0 && `(${formData.notes.length})`}
            </span>
          </div>
          <ApperIcon 
            name={showNotes ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-surface-400" 
          />
        </button>

        <AnimatePresence>
          {showNotes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3">
                {/* Add Note */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 px-3 py-2 border border-surface-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    onKeyPress={(e) => e.key === 'Enter' && addNote()}
                  />
                  <Button
                    type="button"
                    onClick={addNote}
                    disabled={!newNote.trim()}
                    className="px-3 py-2 bg-primary text-white rounded-button hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ApperIcon name="Plus" size={16} />
                  </Button>
                </div>

                {/* Notes List */}
                {formData.notes.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {formData.notes.map((note, index) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start space-x-2 p-3 bg-white rounded-button border border-surface-200"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-surface-700 break-words">{note.text}</p>
                          <p className="text-xs text-surface-400 mt-1">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteNote(note.id)}
                          className="p-1 text-surface-400 hover:text-error transition-colors flex-shrink-0"
                        >
                          <ApperIcon name="X" size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtasks Section */}
      <div className="border-t border-surface-200 pt-4">
        <button
          type="button"
          onClick={() => setShowSubtasks(!showSubtasks)}
          className="flex items-center justify-between w-full p-3 bg-surface-50 rounded-button hover:bg-surface-100 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <ApperIcon name="CheckSquare" size={16} className="text-surface-600" />
            <span className="font-medium text-surface-700">
              Subtasks {totalSubtasks > 0 && `(${completedSubtasks}/${totalSubtasks})`}
            </span>
          </div>
          <ApperIcon 
            name={showSubtasks ? "ChevronUp" : "ChevronDown"} 
            size={16} 
            className="text-surface-400" 
          />
        </button>

        <AnimatePresence>
          {showSubtasks && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-3">
                {/* Progress Bar */}
                {totalSubtasks > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-surface-600">
                      <span>Progress</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        className="h-full bg-success transition-all duration-300"
                      />
                    </div>
                  </div>
                )}

                {/* Add Subtask */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add a subtask..."
                    className="flex-1 px-3 py-2 border border-surface-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                  />
                  <Button
                    type="button"
                    onClick={addSubtask}
                    disabled={!newSubtask.trim()}
                    className="px-3 py-2 bg-primary text-white rounded-button hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ApperIcon name="Plus" size={16} />
                  </Button>
                </div>

                {/* Subtasks List */}
                {formData.subtasks.length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {formData.subtasks.map((subtask, index) => (
                      <motion.div
                        key={subtask.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center space-x-3 p-3 bg-white rounded-button border border-surface-200"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSubtask(subtask.id)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                            subtask.completed
                              ? 'bg-success border-success text-white'
                              : 'border-surface-300 hover:border-success'
                          }`}
                        >
                          {subtask.completed && (
                            <ApperIcon name="Check" size={10} className="animate-check" />
                          )}
                        </button>
                        <span className={`flex-1 text-sm ${
                          subtask.completed 
                            ? 'line-through text-surface-500' 
                            : 'text-surface-700'
                        }`}>
                          {subtask.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteSubtask(subtask.id)}
                          className="p-1 text-surface-400 hover:text-error transition-colors flex-shrink-0"
                        >
                          <ApperIcon name="X" size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex space-x-3 pt-4 border-t border-surface-200">
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