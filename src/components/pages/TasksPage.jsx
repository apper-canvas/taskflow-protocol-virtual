import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TasksHeader from '@/components/organisms/TasksHeader';
import TaskSearchBar from '@/components/molecules/TaskSearchBar';
import TaskFilters from '@/components/organisms/TaskFilters';
import TaskList from '@/components/organisms/TaskList';
import TaskModal from '@/components/organisms/TaskModal';
import { taskService, projectService } from '@/services';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    project: 'all',
    priority: 'all',
    status: 'all'
  });
  const [sortBy, setSortBy] = useState('deadline');

  const loadData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        await taskService.update(editingTask.id, taskData);
        toast.success('Task updated successfully');
      } else {
        await taskService.create(taskData);
        toast.success('Task created successfully');
      }
      setShowTaskModal(false);
      setEditingTask(null);
      await loadData(); // Reload all data to ensure new tasks or updates are reflected
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

  const getPriorityColor = useCallback((priority) => {
    switch (priority) {
      case 'high': return 'text-error bg-red-50 border-red-200';
      case 'medium': return 'text-warning bg-amber-50 border-amber-200';
      case 'low': return 'text-success bg-green-50 border-green-200';
      default: return 'text-surface-600 bg-surface-100 border-surface-200';
    }
  }, []);

  const getProjectColor = useCallback((projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#64748B'; // Default slate color
  }, [projects]);

  const getProjectName = useCallback((projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown';
  }, [projects]);

const isOverdue = useCallback((deadline, completed) => {
    return !completed && new Date(deadline) < new Date();
  }, []);

  const filteredAndSortedTasks = tasks
    .filter(task => {
      // Text search filter
      if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(searchLower);
      const descriptionMatch = task.description.toLowerCase().includes(searchLower);
      const projectName = getProjectName(task.projectId).toLowerCase();
      const projectMatch = projectName.includes(searchLower);
      
      if (!titleMatch && !descriptionMatch && !projectMatch) {
        return false;
      }
    }
    
    // Other filters
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
      case 'title':
        return a.title.localeCompare(b.title);
      case 'project':
        const projectA = getProjectName(a.projectId);
        const projectB = getProjectName(b.projectId);
        return projectA.localeCompare(projectB);
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
          <Button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors"
          >
            Try Again
          </Button>
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
        <TasksHeader onAddTask={() => setShowTaskModal(true)} />

        <TaskSearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          projects={projects}
        />

        <TaskFilters
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          projects={projects}
        />

        <TaskList
          tasks={filteredAndSortedTasks}
          onAddTask={() => setShowTaskModal(true)}
          onTaskToggle={handleTaskToggle}
          onEditTask={handleEditTask}
          onDeleteTask={handleTaskDelete}
          getPriorityColor={getPriorityColor}
          getProjectColor={getProjectColor}
          getProjectName={getProjectName}
          isOverdue={isOverdue}
        />
      </motion.div>

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

export default TasksPage;