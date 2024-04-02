if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
    .then(registration => {
      console.log('Service Worker registered', registration);
      registration.sync.register('task-sync');
      const taskChannel = new BroadcastChannel('task-channel');
      taskChannel.onmessage = event => {
        console.log("broadcast event:", event.data);
        dbStoreTask(event.data.data);
      };
    })
    .catch(err => console.error('Service Worker registration failed', err));
  });
}

async function dbStoreTask(taskData) {
  try {
    const db = indexedDB.open('task-db', 1);
    const tx = db.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    const request = store.add(taskData);
    await request.complete;
    console.log("Task added to IndexedDB:", taskData);
  } catch (error) {
    console.error("IndexedDB error:", error);
  }
}

self.addEventListener('sync', function(event) {
  if (event.tag == 'task-sync') {
    event.waitUntil(async () => {
      try {
        const db = indexedDB.open('task-db', 1);
        const tx = db.transaction('tasks', 'readonly');
        const store = tx.objectStore('tasks');
        const tasks = await store.getAll();
        console.log("SYNC tasks from IndexedDB:", tasks);
      } catch (error) {
        console.error("IndexedDB error in sync event:", error);
      }
    });
  }
});
