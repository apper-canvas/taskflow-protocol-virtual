import React from 'react';
import Modal from '@/components/molecules/Modal';
import ProjectForm from '@/components/organisms/ProjectForm';

const ProjectModal = ({ isOpen, onClose, onSave, project }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Create New Project'}
    >
      <ProjectForm project={project} onSave={onSave} onClose={onClose} />
    </Modal>
  );
};

export default ProjectModal;