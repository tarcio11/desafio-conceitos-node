const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

/**
 * Adicionando Middleware nas rotas com ID
 */

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Inválid Repository ID." })
  }
  return next();
}

app.use('/repositories/:id', validateRepositoryId) // usando em todas as rotas com id

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (findRepositoryIndex >= 0) {
    const repository = {
      id,
      title,
      url,
      techs,
      likes: repositories[findRepositoryIndex].likes,
    }

    repositories[findRepositoryIndex] = repository;

    return response.json(repository);
  } else {
    return response.status(400).json({ error: "Inválid Repository ID." })
  }

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  const findRepositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (findRepositoryIndex >= 0) {
    repositories.splice(findRepositoryIndex, 1);

    return response.status(204).send()
  } else {
    return response.status(400).json({ error: "Inválid Repository ID." });
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const findRepositoryIndex = repositories.findIndex(repo => repo.id === id);

  if (findRepositoryIndex === -1) {
    return response.status(400).json({ error: "Inválid Repository ID." });
  }

  repositories[findRepositoryIndex].likes += 1;

  return response.json(repositories[findRepositoryIndex])
});

module.exports = app;
