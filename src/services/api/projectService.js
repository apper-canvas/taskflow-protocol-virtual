import projectData from '../mockData/projects.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let projects = [...projectData];

const projectService = {
  async getAll() {
    await delay(250);
    return [...projects];
  },

  async getById(id) {
    await delay(200);
    const project = projects.find(p => p.id === id);
    return project ? { ...project } : null;
  },

  async create(projectData) {
    await delay(350);
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      taskCount: 0,
      createdAt: new Date().toISOString()
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, updates) {
    await delay(350);
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    
    projects[index] = {
      ...projects[index],
      ...updates
    };
    
    return { ...projects[index] };
  },

  async updateTaskCount(id, count) {
    await delay(200);
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    
    projects[index].taskCount = count;
    return { ...projects[index] };
  },

  async delete(id) {
    await delay(300);
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Project not found');
    
    projects.splice(index, 1);
    return { success: true };
  }
};

export default projectService;