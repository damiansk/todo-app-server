CREATE DATABASE IF NOT EXISTS TODO_DB;

USE TODO_DB;

CREATE TABLE IF NOT EXISTS TASKS (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status BOOLEAN NOT NULL
);

START TRANSACTION;

INSERT INTO TASKS (title, description, status)
SELECT 'Zadanie 1', 'Opis zadania 1', false
UNION SELECT 'Zadanie 2', 'Opis zadania 2', true
UNION SELECT 'Zadanie 3', 'Opis zadania 3', false
UNION SELECT 'Zadanie 4', 'Opis zadania 4', true
UNION SELECT 'Zadanie 5', 'Opis zadania 5', false
UNION SELECT 'Zadanie 6', 'Opis zadania 6', true
UNION SELECT 'Zadanie 7', 'Opis zadania 7', false
UNION SELECT 'Zadanie 8', 'Opis zadania 8', true
UNION SELECT 'Zadanie 9', 'Opis zadania 9', false
UNION SELECT 'Zadanie 10', 'Opis zadania 10', true
FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM TASKS LIMIT 1);

COMMIT;
