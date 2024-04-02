const URL = "https://8014-35-223-70-178.ngrok-free.app/";
const taskChannel = new BroadcastChannel('task-channel');
taskChannel.onmessage = event => {
  console.log("broadcast event: " + event.data);
  persistTask(event.data.data);
  registration.sync.register('task-sync');
};

let db = null;
let request = indexedDB.open("TaskDB", 1);
request.onupgradeneeded = function(event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains("tasks")) {
    let tasksObjectStore = db.createObjectStore("tasks", { autoIncrement: true });
    //tasksObjectStore.createIndex("statusIndex", "status", { unique: false });
  }
};
request.onsuccess = function(event) { db = event.target.result; };
request.onerror = function(event) { console.log("Error in db: " + event); };

persistTask = function(task){
  let transaction = db.transaction("tasks", "readwrite");
  let tasksObjectStore = transaction.objectStore("tasks");
  let addRequest = tasksObjectStore.add(task);
  addRequest.onsuccess = function(event){ console.log("Task added to DB"); };
  addRequest.onerror = function(event) {  };
}
self.addEventListener('sync', async function(event) {
  console.log("sync event: " + event.tag);
  if (event.tag == 'task-sync') {
    event.waitUntil(new Promise((res, rej) => {
      let transaction = db.transaction("tasks", "readwrite");
      let tasksObjectStore = transaction.objectStore("tasks");
      let cursorRequest = tasksObjectStore.openCursor();
      cursorRequest.onsuccess = function(event) {
        let cursor = event.target.result;
        if (cursor) {
          let task = cursor.value;
          console.log("TASK FROM DB: " + task);
	  fetch(URL + 'todos/add', 
	    { method: 'POST', 
	      headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ "task" : task }) 
	    }).then((serverResponse) => {
	      console.log("Task saved to backend.");
              deleteTasks();
	      res();
  	    }).catch((err) => {
	      console.log("ERROR: " + err);
	      rej();
	    })
          }
        } 
    }))
  }
})
async function deleteTasks() {
  const transaction = db.transaction("tasks", "readwrite");
  const tasksObjectStore = transaction.objectStore("tasks");
  tasksObjectStore.clear();
  await transaction.complete;
}
