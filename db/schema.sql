DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department(
  id INT PRIMARY KEY,
  department_name VARCHAR(30)
);

CREATE TABLE role(
  id INT PRIMARY KEY,
  title VARCHAR(30),
  department_name VARCHAR(30),
  salary DECIMAL
);

CREATE TABLE employee (
  id INT PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT
);
