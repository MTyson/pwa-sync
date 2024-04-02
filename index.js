const express = require('express');
const path = require('path');  // Required for serving static files

const app = express();
const port = process.env.PORT || 3000;  // Use PORT environment variable or default to 3000

app.use(express.json());

// Set the static directory (replace 'public' with your actual folder name if different)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML file for all unmatched routes (catch-all)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Replace with a database connection for persistent storage (e.g., MongoDB)
let tasks = [];

app.post('/todos/add', (req, res) => {
  console.log("req: " + JSON.stringify(req.body));
  const { task } = req.body;
  tasks.push(task);
  res.json({ message: 'Task added successfully' });
  console.log("tasks: " + JSON.stringify(tasks));
});

app.post('/todos/remove', (req, res) => {
  const { task } = req.body;
	console.log("remove: " + task);
  if (task < tasks.length) {
    tasks.splice(task, 1);
    res.json({ message: 'Task removed successfully' });
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

// Example endpoint to retrieve tasks (can be extended for filtering/sorting)
app.get('/todos', (req, res) => {
  res.json(tasks);
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

