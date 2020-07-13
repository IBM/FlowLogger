const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Flow Log Reader', { horizontalLayout: 'full' })
  )
);
