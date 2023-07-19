const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 3001;
const DB_NAME = 'TODO_DB';
const TABLE_NAME = 'Tasks';
const app = express();

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('Błąd połączenia z MySQL:', err);
    return;
  }
  console.log('Połączono z bazą danych MySQL');
});

app.use(bodyParser.json());
app.use(cors());

app.post('/api/todo', (req, res) => {
  const { title, description } = req.body;
  const status = false;

  const query = `INSERT INTO ${TABLE_NAME} (title, description, status) VALUES (?, ?, ?)`;
  connection.query(query, [title, description, status], (err, results) => {
    if (err) {
      console.error('Błąd podczas dodawania zadania:', err);
      res.status(500).json({ error: 'Błąd podczas dodawania zadania' });
      return;
    }
    res.status(201).json({ id: results.insertId, title, description, status });
  });
});

app.delete('/api/todo/:id', (req, res) => {
  const todoId = req.params.id;

  const query = `DELETE FROM ${TABLE_NAME} WHERE id = ?`;
  connection.query(query, [todoId], (err, results) => {
    if (err) {
      console.error('Błąd podczas usuwania zadania:', err);
      res.status(500).json({ error: 'Błąd podczas usuwania zadania' });
      return;
    }
    res.status(200).json({ message: 'Zadanie zostało usunięte' });
  });
});

app.put('/api/todo/:id', (req, res) => {
  const todoId = req.params.id;
  const { status } = req.body;

  const query = `UPDATE ${TABLE_NAME} SET status = ? WHERE id = ?`;
  connection.query(query, [status, todoId], (err, results) => {
    if (err) {
      console.error('Błąd podczas edycji statusu zadania:', err);
      res.status(500).json({ error: 'Błąd podczas edycji statusu zadania' });
      return;
    }
    res.status(200).json({ message: 'Status zadania został zaktualizowany' });
  });
});

app.get('/api/todo', (req, res) => {
  const query = `SELECT * FROM ${TABLE_NAME}`;
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Błąd podczas pobierania listy zadań:', err);
      res.status(500).json({ error: 'Błąd podczas pobierania listy zadań' });
      return;
    }
    res.status(200).json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
