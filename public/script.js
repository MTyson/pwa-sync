if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log('Service Worker registered', registration);
      })
      .catch(err => console.error('Service Worker registration failed', err));
  });
}

const tasks = [];

const taskChannel = new BroadcastChannel('task-channel');

function addTask(task) {
  console.log("new task: " + task);
  taskChannel.postMessage({ type: 'add-task', data: task });

  if (navigator.serviceWorker) {
    navigator.serviceWorker.ready.then(registration => {
      //registration.active.postMessage({ type: 'task-post', task });
    });
  }
}

/*
function addTask(task) {
  console.log("new task: " + task);
  tasks.push(task);
  updateList();
  // Send task addition request to service worker
  if (navigator.serviceWorker) {
    navigator.serviceWorker.ready.then(registration => {
      registration.active.postMessage({ type: 'add-task', task });
    });
  }
}*/

function removeTask(index) {
	console.log("remove: " + index);
  tasks.splice(index, 1);
  updateList();
  // Send task removal request to service worker
  if (navigator.serviceWorker) {
    navigator.serviceWorker.ready.then(registration => {
      registration.active.postMessage({ type: 'remove-task', index });
    });
  }
}

function updateList() {
  const listContainer = document.getElementById('task-list');
  listContainer.innerHTML = ''; // Clear previous list
  tasks.forEach((task, index) => {
    const listItem = document.createElement('li');
    listItem.innerText = task;
    listItem.addEventListener('click', () => removeTask(index));
    listContainer.appendChild(listItem);
  });
}

