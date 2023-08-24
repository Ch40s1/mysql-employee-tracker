const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const config = require('./config');

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
  // creates a connection to mysql. selects all from departments
  dbConnection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    console.table(results);
    // restarts the app
    startApp();
  });
}

function viewAllRoles() {

}

function viewAllEmployees() {

}

function addDepartment() {

}

function addRole() {

}

function addEmployee() {

}

function updateEmployeeRole() {

}

// Call the function to start the application
startApp();
