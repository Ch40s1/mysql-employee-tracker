const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const config = require('./config');

// Create a database connection
const dbConnection = mysql.createConnection(config.database);

// Function to view all departments
function viewAllDepartments() {
  dbConnection.query('SELECT * FROM department', (error, results) => {
    if (error) {
      console.error('Error fetching departments:', error);
      return;
    }

    const formattedResults = results.map((department) => {
      return {
        id: department.id,
        department_name: department.department_name,
      };
    });

    console.log('All Departments:');
    console.table(formattedResults);

    startApp();
  });
}

function addDepartment(){
}

// Function to start the application
function startApp() {
  const initialQuestions = [
    {
      type: "list",
      name: "userChoice",
      message: 'What would you like to do?',
      choices: ['View All Departments', "Add Department",'Quit']
    },
  ];

  inquirer
    .prompt(initialQuestions)
    .then((answer) => {
      switch (answer.userChoice) {
        case 'View All Departments':
          viewAllDepartments();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case 'Quit':
          console.log('Goodbye!');
          dbConnection.end();
          break;
      }
    })
    .catch((error) => {
      console.error('An error occurred:', error);
      dbConnection.end();
    });
}

// Start the application
startApp();
