require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const bodyParser = require('body-parser');
const cors = require('cors');

const AWS_REGION = process.env.AWS_REGION;
const SERVER_PORT = process.env.SERVER_PORT;
const DB_NAME = process.env.DB_NAME;
const TABLE_NAME = process.env.TABLE_NAME;
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

const BUCKET_NAME = 'dstolarek-test001-private';
const DEFAULT_FILE_NAME = 'the-13-best-takes-on-the-windows-xp-bliss-wallpaper-g98pk791q3rr506a.jpg';

console.log('AWS_REGION', AWS_REGION);
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

const s3Client = new S3Client({
  region: AWS_REGION
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

app.get('/api/s3', async (req, res) => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: DEFAULT_FILE_NAME,
    };

    const command = new GetObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    res.json({ signedUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Wystąpił błąd podczas pobierania pliku' });
  }
});

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
