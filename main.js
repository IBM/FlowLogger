const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const inquirer  = require('./inquirer');

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Flow Log Reader', { horizontalLayout: 'full' })
  )
);

const run = async () => {
    const credentials = await inquirer.askAPICredentials();
    console.log(credentials);
  };
  
  run();