require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');


const SERVER_PORT = process.env.SERVER_PORT;
const DB_NAME = process.env.DB_NAME;
const TABLE_NAME = process.env.TABLE_NAME;
const DB_HOST = process.env.TABLE_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

console.log('SERVER_PORT', SERVER_PORT);
console.log('DB_NAME', DB_NAME);
console.log('TABLE_NAME', TABLE_NAME);
console.log('DB_HOST', DB_HOST);
console.log('DB_USER', DB_USER);
console.log('DB_PASSWORD', DB_PASSWORD);

const app = express();

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
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

app.listen(SERVER_PORT, () => {
  console.log(`Example app listening on port ${SERVER_PORT}`)
})
