
// Save Tasks
export const setTasksListLocalstory  = (tasks) => {
  chrome.storage.sync.set({'tasks': tasks}, function() {
    console.log('😄 Create Tasks Success～');
  })
}

// Get Tasks
export const getTasksListLocalstory  = (self) => {
  chrome.storage.sync.get('tasks', (result) => {
    self.list = result.tasks;
    console.log('👌 Get Tasks Success～')
  });
}

// Update Tasks 
export const updateTasksListLocalstory  = (tasks) => {
  chrome.storage.sync.set({'tasks': tasks}, function() {
    console.log('🚀 Update Tasks Success～');
  })
}
