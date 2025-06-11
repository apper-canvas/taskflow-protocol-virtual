import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import TaskItem from '@/components/molecules/TaskItem';

const TaskList = ({ tasks, onAddTask, onTaskToggle, onEditTask, onDeleteTask, getPriorityColor, getProjectColor, getProjectName, isOverdue }) => {
  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onAddTask}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-600 transition-colors"
            >
              Add Task
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <AnimatePresence>
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onTaskToggle}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              getPriorityColor={getPriorityColor}
              getProjectColor={getProjectColor}
              getProjectName={getProjectName}
              isOverdue={isOverdue}
              index={index}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default TaskList;