import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProjectsHeader from '@/components/organisms/ProjectsHeader';
import ProjectGrid from '@/components/organisms/ProjectGrid';
import ProjectModal from '@/components/organisms/ProjectModal';
import { projectService, taskService } from '@/services';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]); // All tasks needed for project task counts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);
      
      setProjects(projectsData);
      setTasks(tasksData); // Store all tasks
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleProjectSave = async (projectData) => {
    try {
      if (editingProject) {
        await projectService.update(editingProject.id, projectData);
        toast.success('Project updated successfully');
      } else {
        await projectService.create(projectData);
        toast.success('Project created successfully');
      }
      setShowProjectModal(false);
      setEditingProject(null);
      await loadData(); // Reload all data to ensure counts are updated
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
        <ProjectsHeader onAddProject={() => setShowProjectModal(true)} />
        
        <ProjectGrid 
          projects={projects} 
          allTasks={tasks} // Pass all tasks for calculations
          onAddProject={() => setShowProjectModal(true)}
          onEditProject={handleEditProject}
          onDeleteProject={handleProjectDelete}
        />
      </motion.div>

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

export default ProjectsPage;