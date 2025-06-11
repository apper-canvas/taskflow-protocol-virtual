import taskService from './taskService';
import projectService from './projectService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const dashboardService = {
  async getStats() {
    await delay(400);
    const [allTasks, projects] = await Promise.all([
      taskService.getAll(),
      projectService.getAll()
    ]);
    
    const completedTasks = allTasks.filter(t => t.completed);
    const pendingTasks = allTasks.filter(t => !t.completed);
    const overdueTasks = allTasks.filter(t => {
      return !t.completed && new Date(t.deadline) < new Date();
    });
    
    // Tasks completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedToday = completedTasks.filter(t => {
      return t.completedAt && new Date(t.completedAt) >= today;
    });
    
    // By priority
    const byPriority = {
      high: allTasks.filter(t => t.priority === 'high').length,
      medium: allTasks.filter(t => t.priority === 'medium').length,
      low: allTasks.filter(t => t.priority === 'low').length
    };
    
    // By project
    const byProject = {};
    projects.forEach(project => {
      byProject[project.name] = allTasks.filter(t => t.projectId === project.id).length;
    });
    
    return {
      totalTasks: allTasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      overdueTasks: overdueTasks.length,
      completedToday: completedToday.length,
      byPriority,
      byProject
    };
  },

  async getChartData() {
    await delay(300);
    const stats = await this.getStats();
    
    return {
      completionChart: {
        series: [stats.completedTasks, stats.pendingTasks],
        labels: ['Completed', 'Pending']
      },
      priorityChart: {
        series: [stats.byPriority.high, stats.byPriority.medium, stats.byPriority.low],
        labels: ['High', 'Medium', 'Low']
      }
    };
  }
};

export default dashboardService;