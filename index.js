const express = require("express");

const server = express();
server.use(express.json());

const projects = [];

var requisicoes = 0;

server.use((req, res, next) => {
  requisicoes = requisicoes + 1;

  console.log(`Requisição número ${requisicoes}: ${req.method} - ${req.url}`);
  next();
});

function checkProject(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  req.project = project;

  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id,
    title,
    tasks: []
  });

  return res.send();
});

server.put("/projects/:id", checkProject, (req, res) => {
  const { title } = req.body;
  req.project.title = title;

  return res.send();
});

server.delete("/projects/:id", checkProject, (req, res) => {
  const index = projects.indexOf(req.project);

  projects.splice(index, 1);
  return res.send();
});

server.post("/projects/:id/tasks", checkProject, (req, res) => {
  const { title } = req.body;

  req.project.tasks.push(title);
  return res.send();
});

server.listen(3333);
