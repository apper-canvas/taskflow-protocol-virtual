import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { projectService, taskService } from '../services';
import ProjectModal from '../components/ProjectModal';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);
      
      // Update task counts for projects
      const updatedProjects = projectsData.map(project => ({
        ...project,
        taskCount: tasksData.filter(task => task.projectId === project.id).length
      }));
      
      setProjects(updatedProjects);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSave = async (projectData) => {
    try {
      if (editingProject) {
        const updatedProject = await projectService.update(editingProject.id, projectData);
        setProjects(projects.map(p => p.id === editingProject.id ? updatedProject : p));
        toast.success('Project updated successfully');
      } else {
        const newProject = await projectService.create(projectData);
        setProjects([...projects, newProject]);
        toast.success('Project created successfully');
      }
      setShowProjectModal(false);
      setEditingProject(null);
    } catch (err) {
      toast.error(`Failed to ${editingProject ? 'update' : 'create'} project`);
    }
  };

  const handleProjectDelete = async (projectId) => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    if (projectTasks.length > 0) {
      toast.error('Cannot delete project with existing tasks');
      return;
    }

    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.delete(projectId);
        setProjects(projects.filter(p => p.id !== projectId));
        toast.success('Project deleted successfully');
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowProjectModal(true);
  };

  const getProjectTasks = (projectId) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getCompletedTasks = (projectId) => {
    return tasks.filter(task => task.projectId === projectId && task.completed).length;
  };

  const getCompletionPercentage = (projectId) => {
    const projectTasks = getProjectTasks(projectId);
    if (projectTasks.length === 0) return 0;
    const completed = getCompletedTasks(projectId);
    return Math.round((completed / projectTasks.length) * 100);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-200 rounded w-40 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-card p-6 shadow-card">
                <div className="h-6 bg-surface-200 rounded w-24 mb-4"></div>
                <div className="h-4 bg-surface-200 rounded w-16 mb-2"></div>
                <div className="h-2 bg-surface-200 rounded w-full"></div>
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
          <h3 className="text-lg font-semibold text-surface-900 mb-2">Failed to load projects</h3>
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
            <h1 className="text-2xl font-heading font-bold text-surface-900">Projects</h1>
            <p className="text-surface-600">Organize your tasks into projects</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowProjectModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors flex items-center space-x-2 shadow-sm"
          >
            <ApperIcon name="Plus" size={16} />
            <span>Add Project</span>
          </motion.button>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12 bg-white rounded-card shadow-card"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <ApperIcon name="Folder" className="w-16 h-16 text-surface-300 mx-auto" />
                </motion.div>
                <h3 className="mt-4 text-lg font-medium text-surface-900">No projects yet</h3>
                <p className="mt-2 text-surface-500">Create your first project to organize tasks</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProjectModal(true)}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors"
                >
                  Add Project
                </motion.button>
              </motion.div>
            </div>
          ) : (
            <AnimatePresence>
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' 
                  }}
                  className="bg-white rounded-card shadow-card overflow-hidden cursor-pointer transition-all duration-200"
                  onClick={() => setSelectedProject(selectedProject === project.id ? null : project.id)}
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
                          <p className="text-sm text-surface-600">{project.taskCount} tasks</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditProject(project);
                          }}
                          className="p-1 text-surface-400 hover:text-primary transition-colors"
                        >
                          <ApperIcon name="Edit" size={16} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProjectDelete(project.id);
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
                          {getCompletionPercentage(project.id)}%
                        </span>
                      </div>
                      <div className="w-full bg-surface-200 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getCompletionPercentage(project.id)}%` }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                          className="h-2 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                      </div>
                    </div>

                    {/* Task Stats */}
                    <div className="flex items-center justify-between text-sm text-surface-600">
                      <span>{getCompletedTasks(project.id)} completed</span>
                      <span>{project.taskCount - getCompletedTasks(project.id)} pending</span>
                    </div>

                    {/* Expanded Task List */}
                    <AnimatePresence>
                      {selectedProject === project.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-surface-200"
                        >
                          <h4 className="text-sm font-medium text-surface-900 mb-3">Recent Tasks</h4>
                          <div className="space-y-2 max-h-40 overflow-y-auto">
                            {getProjectTasks(project.id).slice(0, 5).map(task => (
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
                            ))}
                            {getProjectTasks(project.id).length > 5 && (
                              <p className="text-xs text-surface-500">
                                +{getProjectTasks(project.id).length - 5} more tasks
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setEditingProject(null);
        }}
        onSave={handleProjectSave}
        project={editingProject}
      />
    </div>
  );
};

export default Projects;