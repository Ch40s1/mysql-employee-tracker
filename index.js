const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const config = require('./config');
const { table } = require('console');

// Create a database connection
const dbConnection = mysql.createConnection(config.database);

console.log(
`
  ####### #     # ######  #       ####### #     # ####### #######    #     #    #    #     #    #     #####  ####### ######
#       ##   ## #     # #       #     #  #   #  #       #          ##   ##   # #   ##    #   # #   #     # #       #     #
#       # # # # #     # #       #     #   # #   #       #          # # # #  #   #  # #   #  #   #  #       #       #     #
#####   #  #  # ######  #       #     #    #    #####   #####      #  #  # #     # #  #  # #     # #  #### #####   ######
#       #     # #       #       #     #    #    #       #          #     # ####### #   # # ####### #     # #       #   #
#       #     # #       #       #     #    #    #       #          #     # #     # #    ## #     # #     # #       #    #
####### #     # #       ####### #######    #    ####### #######    #     # #     # #     # #     #  #####  ####### #     #
`
);
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
        'Delete a Role',
        // 'Delete an employee',
        // 'Delete a department',
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
        case 'Delete a Role':
          deleteRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        // case 'Delete an employee':
        //   deleteEmployee();
        //   break;
        // case 'Delete a department':
        //   deleteDepartment();
        //   break;
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
      console.table(results);
    // starts the app again
    startApp();
  });
}

function viewAllRoles() {
  const query = `
    SELECT role.id, role.title, department.department_name, role.salary
    FROM role
    JOIN department ON role.department_id = department.id
  `;

  dbConnection.query(query, (err, results) => {
    if (err) throw err;
    // displays the database in a organized table form
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
  // this selects various information about the employee, their roles, departments and manager names
  const query = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, IFNULL(e.manager_name, 'null') AS manager_name
    FROM employee e
    INNER JOIN role r ON e.role_id = r.id
    INNER JOIN department d ON r.department_id = d.id
  `;
  // handle the results
  dbConnection.query(query, (err, results) => {
    if (err) throw err;
    // displa the results in a formatted table usign the console.table
    console.table(results.map(result => ({
      id: result.id,
      first_name: result.first_name,
      last_name: result.last_name,
      title: result.title,
      department_name: result.department_name,
      salary: result.salary,
      manager_name: result.manager_name
    })));

    // after displaying the results then restart the app
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
  // Get the list of departments
  const departmentQuery = 'SELECT * FROM department';
  dbConnection.query(departmentQuery, (err, departments) => {
    if (err) throw err;

    // Get the maximum id from the role table
    const maxRoleIdQuery = 'SELECT MAX(id) as maxRoleId FROM role';
    dbConnection.query(maxRoleIdQuery, (err, maxRoleIdResult) => {
      if (err) throw err;

      const maxRoleId = maxRoleIdResult[0].maxRoleId;
      const newRoleId = maxRoleId + 1;

      inquirer
        .prompt([
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
            name: 'roleSalary',
            type: 'input',
            message: 'Enter the salary for the role:',
            validate: input => {
              if (!isNaN(parseFloat(input)) && parseFloat(input) >= 0) {
                return true;
              }
              return 'Please enter a valid non-negative number for the salary.';
            }
          },
          {
            name: 'departmentName',
            type: 'list',
            message: 'Select the department for the role:',
            choices: departments.map(department => department.department_name)
          }
        ])
        .then(answers => {
          const roleTitle = answers.roleTitle;
          const roleSalary = parseFloat(answers.roleSalary);
          const departmentName = answers.departmentName;

          // Get the department ID based on the selected department name
          const departmentId = departments.find(department => department.department_name === departmentName).id;

          // Insert the new role data into the role table
          dbConnection.query('INSERT INTO role (id, title, department_id, salary) VALUES (?, ?, ?, ?)', [newRoleId, roleTitle, departmentId, roleSalary], (err, result) => {
            if (err) throw err;
            console.log(`Role "${roleTitle}" with ID ${newRoleId} added successfully!`);
            startApp();
          });
        });
    });
  });
}
function deleteRole() {
  // Get the list of roles
  const roleQuery = 'SELECT * FROM role';
  dbConnection.query(roleQuery, (err, roles) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: 'roleToDelete',
          type: 'list',
          message: 'Select the role to delete:',
          choices: roles.map(role => `${role.id} - ${role.title}`)
        }
      ])
      .then(answer => {
        const roleIdToDelete = parseInt(answer.roleToDelete.split(' ')[0]);

        // Delete the role from the role table
        dbConnection.query('DELETE FROM role WHERE id = ?', [roleIdToDelete], (err, result) => {
          if (err) throw err;
          console.log(`Role with ID ${roleIdToDelete} deleted successfully!`);
          startApp();
        });
      });
  });
}


function addEmployee() {
  // These are predefined managers
  const predefinedManagers = [
    'Robert Blo',
    'Doe Jane',
    'Chris Doe',
  ];

  // SQL retrieves manager names from the employee table
  const managerQuery = 'SELECT DISTINCT manager_name FROM employee WHERE manager_name IS NOT NULL';

  // Gets existing manager names from the database
  dbConnection.query(managerQuery, (err, managerResults) => {
    if (err) throw err;
    // Take existing manager names from the query results
    const databaseManagers = managerResults.map(result => result.manager_name);
    const allManagers = [...predefinedManagers, ...databaseManagers];

    // Query to retrieve all roles
    const roleQuery = 'SELECT * FROM role';
    dbConnection.query(roleQuery, (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
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
            type: 'list', // Change type to 'list' for selection from a list
            message: 'Select the employee\'s role:',
            choices: roles.map(role => ({ name: role.title, value: role.id })) // Mapping roles to choices
          },
          {
            name: 'employeeManager',
            type: 'list',
            message: 'Select the employee\'s manager:',
            choices: allManagers
          }
        ])
        .then(answer => {
          // Extract user info
          const employeeFirstName = answer.employeeFirstName;
          const employeeLastName = answer.employeeLastName;
          const employeeRoleId = parseInt(answer.employeeRole); // Using the selected role ID
          const employeeManager = answer.employeeManager;

          // Find the selected role based on the provided role id
          const selectedRole = roles.find(role => role.id === employeeRoleId);

          // Get info about the selected role
          const role_id = selectedRole.id;
          const title = selectedRole.title;
          const department_name = selectedRole.department_name;
          const salary = selectedRole.salary;

          // Query to retrieve the maximum employee id from the employee table
          const maxEmployeeIdQuery = 'SELECT MAX(id) as maxEmployeeId FROM employee';
          dbConnection.query(maxEmployeeIdQuery, (err, maxEmployeeIdResult) => {
            if (err) throw err;

            // Calculate the new employee id based on the maximum employee id
            const maxEmployeeId = maxEmployeeIdResult[0].maxEmployeeId;
            const newEmployeeId = maxEmployeeId + 1;

            // Insert the new employee information into the employee table
            dbConnection.query('INSERT INTO employee (id, first_name, last_name, role_id, manager_name) VALUES (?, ?, ?, ?, ?)', [newEmployeeId, employeeFirstName, employeeLastName, role_id, employeeManager], (err, result) => {
              if (err) throw err;

              // Display a success message and the information of the new employee
              console.log("Employee added");
              console.table([{
                id: newEmployeeId,
                first_name: employeeFirstName,
                last_name: employeeLastName,
                title: title,
                department_name: department_name,
                salary: salary,
                manager_id: employeeManager
              }]);

              startApp();
            });
          });
        });
    });
  });
}


function updateEmployeeRole() {
  const employeeQuery = 'SELECT id, first_name, last_name FROM employee';
  const roleQuery = 'SELECT id, title FROM role';

  dbConnection.query(employeeQuery, (err, employees) => {
    if (err) throw err;

    dbConnection.query(roleQuery, (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'employeeId',
            type: 'list',
            message: 'Select the employee to update:',
            choices: employees.map(employee => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id
            }))
          },
          {
            // this looks for the role value using the role id
            name: 'newRoleId',
            type: 'list',
            message: 'Select the new role for the employee:',
            choices: roles.map(role => ({
              name: role.title,
              value: role.id
            }))
          }
        ])
        .then(answer => {
          const employeeId = answer.employeeId;
          const newRoleId = answer.newRoleId;

          // updates the employee role using the role id.
          dbConnection.query('UPDATE employee SET role_id = ? WHERE id = ?', [newRoleId, employeeId], (err, result) => {
            if (err) throw err;
            console.log('Employee role updated successfully!\n');
            startApp();
          });
        });
    });
  });
}
// Call the function to start the application
startApp();
