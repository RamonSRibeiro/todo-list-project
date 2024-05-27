const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Servir arquivos estáticos do diretório raiz
app.use(express.static(path.join(__dirname)));

// Rota para servir a página index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para obter todas as tarefas
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

// Rota para criar uma nova tarefa
app.post('/tasks', (req, res) => {
  const { description } = req.body;
  db.run('INSERT INTO tasks (description) VALUES (?)', [description], function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).json({ id: this.lastID });
    }
  });
});

// Rota para atualizar uma tarefa
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { description, completed } = req.body;
  db.run(
    'UPDATE tasks SET description = ?, completed = ? WHERE id = ?',
    [description, completed, id],
    function (err) {
      if (err) {
        res.status(500).send(err.message);
      } else {
        res.json({ changes: this.changes });
      }
    }
  );
});

// Rota para deletar uma tarefa
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json({ changes: this.changes });
    }
  });
});

