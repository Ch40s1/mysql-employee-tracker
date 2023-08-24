INSERT INTO department (id, department_name)
VALUES
(1, 'Sales'),
(2, 'Legal'),
(3, 'Finance'),
(4, 'Engineering');

INSERT INTO role (id, title, department_name, salary)
VALUES
(1, 'Sales Lead', 'Sales', 100000),
(2, 'Salesperson', 'Sales', 80000),
(3, 'Lead Engineer', 'Engineering', 130000),
(4, 'Accountant', 'Finace', 100000),
(5, 'Lawyer', 'Legal', 130000);

INSERT INTO employee (id, first_name, last_name, role_id, manager_name)
VALUES
(1, 'John', 'Doe', 1, null),
(2, 'Jane', 'Smith', 2, 'dan'),
(3, 'Michael', 'Johnson', 3, 'dan'),
(4, 'Emily', 'Williams', 4, 'dan'),
(5, 'David', 'Brown', 5, 'dan');
