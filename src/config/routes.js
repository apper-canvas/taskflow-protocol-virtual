import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import Projects from '../pages/Projects';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
    component: Tasks
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'Folder',
    component: Projects
  }
};

export const routeArray = Object.values(routes);