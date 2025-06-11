import React from 'react';
import Modal from '@/components/molecules/Modal';
import TaskForm from '@/components/organisms/TaskForm';

const TaskModal = ({ isOpen, onClose, onSave, task, projects }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
    >
      <TaskForm task={task} onSave={onSave} onClose={onClose} projects={projects} />
    </Modal>
  );
};

export default TaskModal;