const fs = require('fs');
const inquirer = require('inquirer');
const initialQuestions = [
  {
    // question asks user for the text they want
    type: "list",
    name: "userText",
    message: 'What text would you like?',
    choices: ['hello', 'Daniel']
  },
];
// compiles the data and returns as usable data
inquirer
.prompt(initialQuestions)
.then((data) =>{
  if (data.userText === 'hello'){
    console.log('world');
  }
  console.log(JSON.stringify(data));
});
