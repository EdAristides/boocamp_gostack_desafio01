const express = require('express');

const server = express();

server.use(express.json());

// Query params = ?teste=1
// Route params = /projects/1
// Request body = { "id": 1, "title": "Projeto", "tasks": []}

const projects = [
  {
    id: "1",
    title: "Projeto1",
    tasks: []
  },
  {
    id: "2",
    title: "Projeto2",
    tasks: []
  }
];

server.use((req, res, next) => {
  console.count("Número de requisições");

  return next();
});

function checkIdExists(req, res, next){
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if(!project){
    return res.status(400).json({error: 'Id not found on request'}); 
  }

  return next();
};

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project);

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title

  return res.json(project);
});

server.delete('/projects/:id', checkIdExists, (req, res) => {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  projects.splice(project, 1);

  return res.json(projects);
});

server.post('/projects/:id/tasks', checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);