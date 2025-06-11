import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let tasks = [...taskData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  },

  async getByProject(projectId) {
    await delay(300);
    return tasks.filter(t => t.projectId === projectId).map(t => ({ ...t }));
  },

  async getByPriority(priority) {
    await delay(300);
    return tasks.filter(t => t.priority === priority).map(t => ({ ...t }));
  },

  async getCompleted() {
    await delay(300);
    return tasks.filter(t => t.completed).map(t => ({ ...t }));
  },

  async getPending() {
    await delay(300);
    return tasks.filter(t => !t.completed).map(t => ({ ...t }));
  },

  async getOverdue() {
    await delay(300);
    const now = new Date();
    return tasks.filter(t => !t.completed && new Date(t.deadline) < now).map(t => ({ ...t }));
  },

  async getDueToday() {
    await delay(300);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return tasks.filter(t => {
      const deadline = new Date(t.deadline);
      return deadline >= today && deadline < tomorrow;
    }).map(t => ({ ...t }));
  },

async create(taskData) {
    await delay(400);
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: taskData.notes || [],
      subtasks: taskData.subtasks || []
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(400);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    tasks[index] = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...tasks[index] };
  },

  // Note management
  async addNote(taskId, noteText) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error('Task not found');
    
    const newNote = {
      id: Date.now().toString(),
      text: noteText,
      createdAt: new Date().toISOString()
    };
    
    if (!tasks[index].notes) {
      tasks[index].notes = [];
    }
    
    tasks[index].notes.push(newNote);
    tasks[index].updatedAt = new Date().toISOString();
    
    return { ...tasks[index] };
  },

  async deleteNote(taskId, noteId) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error('Task not found');
    
    if (tasks[index].notes) {
      tasks[index].notes = tasks[index].notes.filter(note => note.id !== noteId);
      tasks[index].updatedAt = new Date().toISOString();
    }
    
    return { ...tasks[index] };
  },

  // Subtask management
  async addSubtask(taskId, subtaskTitle) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error('Task not found');
    
    const newSubtask = {
      id: Date.now().toString(),
      title: subtaskTitle,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    if (!tasks[index].subtasks) {
      tasks[index].subtasks = [];
    }
    
    tasks[index].subtasks.push(newSubtask);
    tasks[index].updatedAt = new Date().toISOString();
    
    return { ...tasks[index] };
  },

  async toggleSubtask(taskId, subtaskId) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error('Task not found');
    
    if (tasks[index].subtasks) {
      const subtaskIndex = tasks[index].subtasks.findIndex(st => st.id === subtaskId);
      if (subtaskIndex !== -1) {
        tasks[index].subtasks[subtaskIndex].completed = !tasks[index].subtasks[subtaskIndex].completed;
        tasks[index].updatedAt = new Date().toISOString();
      }
    }
    
    return { ...tasks[index] };
  },

  async deleteSubtask(taskId, subtaskId) {
    await delay(200);
    const index = tasks.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error('Task not found');
    
    if (tasks[index].subtasks) {
      tasks[index].subtasks = tasks[index].subtasks.filter(subtask => subtask.id !== subtaskId);
      tasks[index].updatedAt = new Date().toISOString();
    }
    
    return { ...tasks[index] };
  },

  async toggleComplete(id) {
    await delay(300);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
    const completed = !tasks[index].completed;
    tasks[index] = {
      ...tasks[index],
      completed,
      completedAt: completed ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString()
    };
    
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(300);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Task not found');
    
tasks.splice(index, 1);
return { success: true };
},

async search(query) {
  await delay(300);
  if (!query || query.trim().length === 0) {
    return [...tasks];
  }

  const searchTerm = query.toLowerCase().trim();
  return tasks.filter(task => {
    const titleMatch = task.title.toLowerCase().includes(searchTerm);
    const descriptionMatch = task.description.toLowerCase().includes(searchTerm);
    return titleMatch || descriptionMatch;
  }).map(t => ({ ...t }));
},

async getSuggestions(query, projects = []) {
  await delay(200);
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.toLowerCase().trim();
  const suggestions = [];
  const addedTexts = new Set(); // Prevent duplicates

  // Search task titles
  tasks.forEach(task => {
    if (task.title.toLowerCase().includes(searchTerm)) {
      const text = task.title;
      if (!addedTexts.has(text.toLowerCase())) {
        suggestions.push({
          id: task.id,
          type: 'task',
          text: text,
          subtitle: `in ${projects.find(p => p.id === task.projectId)?.name || 'Unknown Project'}`
        });
        addedTexts.add(text.toLowerCase());
      }
    }
  });

  // Search task descriptions
  tasks.forEach(task => {
    if (task.description.toLowerCase().includes(searchTerm)) {
      const text = task.description;
      if (!addedTexts.has(text.toLowerCase()) && suggestions.length < 8) {
        suggestions.push({
          id: task.id,
          type: 'description',
          text: text.length > 50 ? text.substring(0, 50) + '...' : text,
          subtitle: `from "${task.title}"`
        });
        addedTexts.add(text.toLowerCase());
      }
    }
  });

  // Search project names
  projects.forEach(project => {
    if (project.name.toLowerCase().includes(searchTerm)) {
      const text = project.name;
      if (!addedTexts.has(text.toLowerCase()) && suggestions.length < 8) {
        suggestions.push({
          id: project.id,
          type: 'project',
          text: text,
          subtitle: `Project`
        });
        addedTexts.add(text.toLowerCase());
      }
    }
  });

  return suggestions.slice(0, 8); // Limit to 8 suggestions
}
};

export default taskService;