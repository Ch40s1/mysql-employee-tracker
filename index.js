const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const config = require('./config');
const { table } = require('console');

// Create a database connection
const dbConnection = mysql.createConnection(config.database);

// function to start app
function startApp() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    })
    // different cases for each answer
    .then(answer => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Goodbye!');
          process.exit();
      }
    });
}

function viewAllDepartments() {
  // creates a connection to the mysql server and selects all from the department in employee.db
  dbConnection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    // this is for the looks
    console.log('id  department_name');
    console.log('--  ---------------');
    // this so that it looks like the '--' are folling the values
    results.forEach(result => {
      console.log(`${result.id.toString().padStart(2)}   ${result.department_name}`);
    });
    // starts the app again
    startApp();
  });
}

function viewAllRoles() {
  dbConnection.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;
    console.table(results.map(result => ({
      id: result.id,
      title: result.title,
      department_name: result.department_name,
      salary: result.salary
    })));

    // Start the app again
    startApp();
  });
}


function viewAllEmployees() {
  dbConnection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;

    console.table(results.map(result => ({
      id: result.id,
      first_name: result.first_name,
      last_name: result.last_name,
      role_id: result.role_id,
      manager_id: result.manager_id
    })));

    // Start the app again
    startApp();
  });
}

function addDepartment() {
  // asks questions needed for the values
  inquirer
    .prompt([
      {
        name: 'departmentId',
        type: 'input',
        message: 'Enter the department ID:',
        // makes sure that the id is a converted into an integer and if we typed a valid id number
        validate: input => {
          if (Number.isInteger(parseInt(input)) && parseInt(input) > 0) {
            return true;
          }
          return 'Please enter a valid positive integer for the department ID.';
        }
      },
      {
        name: 'departmentName',
        type: 'input',
        message: 'Enter the name of the department:',
        // makes sure there is no empty string
        validate: input => {
          if (input.trim() !== '') {
            return true;
          }
          return 'Please enter a valid department name.';
        }
      }
    ])
    .then(answers => {
      const departmentId = parseInt(answers.departmentId);
      const departmentName = answers.departmentName;

      // acts like the seeds,sql and adds the values to the data
      dbConnection.query('INSERT INTO department (id, department_name) VALUES (?, ?)', [departmentId, departmentName], (err, result) => {
        if (err) throw err;
        console.log(`Department "${departmentName}" with ID ${departmentId} added successfully!`);
        startApp();
      });
    });
}

function addRole() {
  // Ask questions to gather role information
  inquirer
    .prompt([
      {
        name: 'roleId',
        type: 'input',
        message: 'Enter the role ID:',
        validate: input => {
          if (Number.isInteger(parseInt(input)) && parseInt(input) > 0) {
            return true;
          }
          return 'Please enter a valid positive integer for the role ID.';
        }
      },
      {
        name: 'roleTitle',
        type: 'input',
        message: 'Enter the title of the role:',
        validate: input => {
          if (input.trim() !== '') {
            return true;
          }
          return 'Please enter a valid role title.';
        }
      },
      {
        name: 'roleDepartment',
        type: 'input',
        message: 'Enter the department name for the role:',
        validate: input => {
          if (input.trim() !== '') {
            return true;
          }
          return 'Please enter a valid department name.';
        }
      },
      {
        name: 'roleSalary',
        type: 'input',
        message: 'Enter the salary for the role:',
        validate: input => {
          if (!isNaN(parseFloat(input)) && parseFloat(input) >= 0) {
            return true;
          }
          return 'Please enter a valid non-negative number for the salary.';
        }
      }
    ])
    .then(answers => {
      const roleId = parseInt(answers.roleId);
      const roleTitle = answers.roleTitle;
      const roleSalary = parseFloat(answers.roleSalary);
      const roleDepartment = answers.roleDepartment;

      // Insert the new role data into the role table
      dbConnection.query('INSERT INTO role (id, title, department_name, salary) VALUES (?, ?, ?, ?)', [roleId, roleTitle, roleDepartment, roleSalary,], (err, result) => {
        if (err) throw err;
        //console.log(`Role "${roleTitle}" with ID ${roleId} added successfully!`);
        startApp();
      });
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        name: 'employeeId',
        type: 'input',
        validate: input => {
          if (Number.isInteger(parseInt(input)) && parseInt(input) > 0) {
            return true;
          }
          return 'Please enter a valid positive integer for the ID.';
        }
      },
      {
        name: 'employeeFirstName',
        type: 'input',
        message: 'Enter the employee first name:',
        validate: input => {
          if (input.trim() !== '') {
            return true;
          }
          return 'Please enter a valid first name.';
        }
      },
      {
        name: 'employeeLastName',
        type: 'input',
        message: 'Enter the employee last name:',
        validate: input => {
          if (input.trim() !== '') {
            return true;
          }
          return 'Please enter a valid last name.';
        }
      },
      {
        name: 'employeeRole',
        type: 'input',
        message: 'Enter the employee\'s role ID:',
        validate: input => {
          if (Number.isInteger(parseInt(input)) && parseInt(input) > 0) {
            return true;
          }
          return 'Please enter a valid positive integer for the role ID.';
        }
      },
      {
        name: 'employeeManager',
        type: 'input',
        message: 'Enter the manager\'s name:',
        validate: input => {
          if (input.trim() !== '') {
            return true;
          }
          return 'Please enter a name.';
        }
      }
    ])
    .then(answers => {
      const employeeId = parseInt(answers.employeeId);
      const employeeFirstName = answers.employeeFirstName;
      const employeeLastName = answers.employeeLastName;
      const employeeRole = parseInt(answers.employeeRole);
      const employeeManager = answers.employeeManager;

      // Insert the new employee data into the employee table
      dbConnection.query('INSERT INTO employee (id, first_name, last_name, role_id, manager_name) VALUES (?, ?, ?, ?, ?)', [employeeId, employeeFirstName, employeeLastName, employeeRole, employeeManager], (err, result) => {
        if (err) throw err;
        console.log(`Employee "${employeeFirstName} ${employeeLastName}" with ID ${employeeId} added successfully!`);
        startApp();
      });
    });
}



function updateEmployeeRole() {

}

// Call the function to start the application
startApp();
