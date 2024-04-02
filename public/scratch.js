/*
self.addEventListener('message', event => {
  console.log("BEGIN message");
  const { type, task, index } = event.data;
        console.log("type: " + type);
  if (type === 'add-task') {
    // Add task to Cache Storage (using a specific cache name)
    event.waitUntil(
      caches.open('task-cache')
        .then(cache => {
          cache.put('tasks', [task]) // Store task array
        }).then((cache) => {
          return cache.match('tasks');
        }).then(response => {
          if (response) {
            const taskData = response.text();
            console.log("Retrieved task from cache:", taskData);
          } else {
            console.log("Failed to retrieve task from cache");
          }
        })
    );
    // Attempt to update backend in the background
    console.log("add-task: " + task);
    updateBackend(task, 'add');
  } else if (type === 'remove-task') {
          console.log("remove-task: " + task + " " + index)
    // Update task list in Cache Storage
    event.waitUntil(
      caches.open('task-cache')
        .then(cache => {
          return cache.match('tasks') // Fetch current task list
            .then(response => {
              if (response) {
                return response.json()
                  .then(storedTasks => {
                    storedTasks.splice(index, 1); // Remove task
                    return cache.put('tasks', new Response(JSON.stringify(storedTasks)));
                  });
              }
            });
        })
    );
    // Attempt to update backend in the background
    updateBackend(index, 'remove');
  }
});

async function updateBackend(task, action) {
  console.log("updateBackend: " + task + ", " + action);
  try {
    const response = await fetch(URL +'/todos/' + action, {
      method: 'POST',
      body: JSON.stringify({ task }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      console.error('Failed to update backend:', response.statusText);
      // Implement logic to handle failed update (e.g., store flag for later sync)
    }
  } catch (error) {
    console.error('Error updating backend:', error);
    // Implement logic to handle errors (e.g., store flag for later sync)
  }
}
*/
