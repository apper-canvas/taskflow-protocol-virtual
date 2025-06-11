import DashboardPage from '@/components/pages/DashboardPage';
import TasksPage from '@/components/pages/TasksPage';
import ProjectsPage from '@/components/pages/ProjectsPage';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: 'LayoutDashboard',
icon: 'LayoutDashboard',
    component: DashboardPage
  },
  tasks: {
    id: 'tasks',
    label: 'Tasks',
    path: '/tasks',
    icon: 'CheckSquare',
icon: 'CheckSquare',
    component: TasksPage
  },
  projects: {
    id: 'projects',
    label: 'Projects',
    path: '/projects',
    icon: 'Folder',
icon: 'Folder',
    component: ProjectsPage
  }
};

export const routeArray = Object.values(routes);