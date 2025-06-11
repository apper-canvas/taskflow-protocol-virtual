import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import ProjectCard from '@/components/molecules/ProjectCard';

const ProjectGrid = ({ projects, allTasks, onAddProject, onEditProject, onDeleteProject }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  const getProjectTasks = useCallback((projectId) => {
    return allTasks.filter(task => task.projectId === projectId);
  }, [allTasks]);

  return (
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                    onClick={onAddProject}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors"
                >
                    Add Project
                </Button>
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <AnimatePresence>
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              projectTasks={getProjectTasks(project.id)}
              onEdit={onEditProject}
              onDelete={onDeleteProject}
              onToggleExpand={() => setSelectedProjectId(selectedProjectId === project.id ? null : project.id)}
              isExpanded={selectedProjectId === project.id}
              index={index}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default ProjectGrid;