
// Save Tasks
export const setTasksListLocalstory  = (tasks) => {
  chrome.storage.sync.set({'tasks': tasks}, function() {
    console.log('😄 Create Tasks Success～', tasks);
  })
}

// Get Tasks
export const getTasksListLocalstory  = (self) => {
  chrome.storage.sync.get('tasks', (result) => {
    self.tasks = result.tasks;
    console.log('👌 Get Tasks Success～', result.tasks)
  });
}

// Update Tasks 
export const updateTasksListLocalstory  = (tasks) => {
  chrome.storage.sync.set({'tasks': tasks}, function() {
    console.log('🚀 Update Tasks Success～', tasks);
  })
}
