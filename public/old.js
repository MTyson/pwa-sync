//const URL = 'http://34.72.136.140:3000';
const URL = 'https://8014-35-223-70-178.ngrok-free.app';

tasksToAdd = [];

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => { 
	console.log('Service Worker registered', registration);
        const taskChannel = new BroadcastChannel('task-channel');
        taskChannel.onmessage = (event) => {
          console.log("broadcast event: " + event.data);
	  tasksToAdd.push(event.data.data);
	  console.log("added: " + JSON.stringify(tasksToAdd));
          registration.FOO = "BAR";	
          registration.sync.register('task-sync');
        }
      })
      .catch(err => console.error('Service Worker registration failed', err));
  });
}

self.addEventListener('sync', function(event) {
  console.log("sync event: " + JSON.stringify(event));

  console.log("FOOBAR: " + self.registration.FOO);

  console.log("A SYNC add-task: "+ JSON.stringify(tasksToAdd));
  if (event.tag == 'task-sync') {
    //event.waitUntil(logWithDelay());
    console.log("SYNC add-task: "+ JSON.stringify(tasksToAdd));
  }
});

function logWithDelay(message) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Log message:", JSON.stringify(tasksToAdd) );
      resolve(); // Resolve the promise after logging
    }, 1000); // Simulate a 1-second delay
  });
}
