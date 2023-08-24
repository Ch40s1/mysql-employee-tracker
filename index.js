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

}

function viewAllEmployees() {

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

}

function addEmployee() {

}

function updateEmployeeRole() {

}

// Call the function to start the application
startApp();
