import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { taskService, projectService } from '../services';
import TaskModal from '../components/TaskModal';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    project: 'all',
    priority: 'all',
    status: 'all'
  });
  const [sortBy, setSortBy] = useState('deadline');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskToggle = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task marked as pending');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleTaskSave = async (taskData) => {
    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.id, taskData);
        setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
        toast.success('Task updated successfully');
      } else {
        const newTask = await taskService.create(taskData);
        setTasks([...tasks, newTask]);
        toast.success('Task created successfully');
      }
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(`Failed to ${editingTask ? 'update' : 'create'} task`);
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.delete(taskId);
        setTasks(tasks.filter(t => t.id !== taskId));
        toast.success('Task deleted successfully');
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-red-50 border-red-200';
      case 'medium': return 'text-warning bg-amber-50 border-amber-200';
      case 'low': return 'text-success bg-green-50 border-green-200';
      default: return 'text-surface-600 bg-surface-100 border-surface-200';
    }
  };

  const getProjectColor = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#64748B';
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown';
  };

  const isOverdue = (deadline, completed) => {
    return !completed && new Date(deadline) < new Date();
  };

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filters.project !== 'all' && task.projectId !== filters.project) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.status === 'completed' && !task.completed) return false;
      if (filters.status === 'pending' && task.completed) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-32 mb-6"></div>
          <div className="flex space-x-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-surface-200 rounded w-24"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-card p-4 shadow-card">
                <div className="h-5 bg-surface-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Failed to load tasks</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-heading font-bold text-surface-900">Tasks</h1>
            <p className="text-surface-600">Manage and organize your tasks</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add Task</span>
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-card p-4 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-surface-700">Project:</label>
              <select
                value={filters.project}
                onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                className="px-3 py-1 border border-surface-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-surface-700">Priority:</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="px-3 py-1 border border-surface-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-surface-700">Status:</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-3 py-1 border border-surface-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-surface-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-surface-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="deadline">Deadline</option>
                <option value="priority">Priority</option>
                <option value="created">Created Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredAndSortedTasks.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12 bg-white rounded-card shadow-card"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="CheckSquare" className="w-16 h-16 text-surface-300 mx-auto" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-surface-900">No tasks found</h3>
              <p className="mt-2 text-surface-500">Create your first task to get started</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTaskModal(true)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors"
              >
                Add Task
              </motion.button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {filteredAndSortedTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
                  className="bg-white rounded-card p-4 shadow-card cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => handleTaskToggle(task.id)}
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
                        </div>

                        <div className="flex items-center space-x-2 flex-shrink-0">
                          <button
                            onClick={() => handleEditTask(task)}
                            className="p-1 text-surface-400 hover:text-primary transition-colors"
                          >
                            <ApperIcon name="Edit" size={16} />
                          </button>
                          <button
                            onClick={() => handleTaskDelete(task.id)}
                            className="p-1 text-surface-400 hover:text-error transition-colors"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span 
                          className="text-xs px-2 py-1 rounded-full text-white"
                          style={{ backgroundColor: getProjectColor(task.projectId) }}
                        >
                          {getProjectName(task.projectId)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <div className={`flex items-center space-x-1 text-xs ${
                          isOverdue(task.deadline, task.completed) ? 'text-error' : 'text-surface-500'
                        }`}>
                          <ApperIcon name="Calendar" size={12} />
                          <span>
                            {format(new Date(task.deadline), 'MMM dd, yyyy')}
                          </span>
                          {isOverdue(task.deadline, task.completed) && (
                            <span className="text-error font-medium">(Overdue)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* Task Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        onSave={handleTaskSave}
        task={editingTask}
        projects={projects}
      />
    </div>
  );
};

export default Tasks;