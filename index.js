const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const config = require('./config');
// let viewAllEmployees;
// let addEmployee;
// let updateEmployeeRole;
// let addRole;
// let viewAllDepartments;
// let addDepartment;
// let quit;

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

    // End the database connection
    dbConnection.end();
  });
}


const initialQuestions = [
  {
    // question asks user for the text they want
    type: "list",
    name: "userText",
    message: 'What would you like to do?',
    choices: ['View All Departments', 'Quit']
  },
];
// compiles the data and returns as usable data
inquirer
.prompt(initialQuestions)
.then((data) =>{
  if (data.userText === 'View All Departments') {
    viewAllDepartments(); // Call the function to view departments
  } else {
    console.log('Goodbye!');
    dbConnection.end(); // End the database connection
  }
})
.catch((error) => {
  console.error('Prompt error:', error);
  dbConnection.end(); // Ensure the database connection is closed on error
});
