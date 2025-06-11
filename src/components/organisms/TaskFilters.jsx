import React from 'react';
import Select from '@/components/atoms/Select';

const TaskFilters = ({ filters, setFilters, sortBy, setSortBy, projects }) => {
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

return (
  <div className="bg-white rounded-card p-4 shadow-card">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-surface-700">Project</label>
        <Select
          value={filters.project}
          onChange={(e) => handleFilterChange('project', e.target.value)}
          className="px-3 py-2 border border-surface-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
        >
          <option value="all">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-surface-700">Priority</label>
        <Select
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="px-3 py-2 border border-surface-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Select>
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-surface-700">Status</label>
        <Select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-3 py-2 border border-surface-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </Select>
      </div>

      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-surface-700">Sort by</label>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-surface-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
        >
          <option value="deadline">Deadline</option>
          <option value="priority">Priority</option>
          <option value="created">Created Date</option>
          <option value="title">Title</option>
          <option value="project">Project</option>
        </Select>
      </div>
    </div>
  </div>
  );
};

export default TaskFilters;