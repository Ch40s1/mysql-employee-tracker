-- Populate departments
INSERT INTO department (id, department_name)
VALUES
(1, 'Sales'),
(2, 'Engineering'),
(3, 'Finance'),
(4, 'Legal');

-- Populate roles
INSERT INTO role (id, title, department_id, salary)
VALUES
(1, 'Sales Lead', (SELECT id FROM department WHERE department_name = 'Sales'), 100000),
(4, 'Lawyer', (SELECT id FROM department WHERE department_name = 'Legal'), 130000),
(3, 'Accountant', (SELECT id FROM department WHERE department_name = 'Finance'), 100000),
(2, 'Lead Engineer', (SELECT id FROM department WHERE department_name = 'Engineering'), 130000);

-- SELECT role.id, role.title, department.department_name, role.salary
-- FROM role
-- JOIN department ON role.department_id = department.id;
-- code to get this
-- | id | title         | department_name | salary |
-- +----+---------------+-----------------+--------+
-- |  1 | Sales Lead    | Sales           | 100000 |
-- |  2 | Lead Engineer | Engineering     | 130000 |
-- |  3 | Accountant    | Finance         | 100000 |
-- |  4 | Lawyer        | Legal           | 130000 |
-- +----+---------------+-----------------+--------+

-- Populate employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_name)
VALUES
(1, 'John', 'Doe', 1, null),
(2, 'Jane', 'Smith', 2, 'dan'),
(3, 'Michael', 'Johnson', 3, 'dan'),
(4, 'Emily', 'Williams', 4, 'dan'),
(5, 'David', 'Brown', 5, 'dan');
