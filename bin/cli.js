#!/usr/bin/env node
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const { input } = require('../flow_parse.js');

clear();

console.log(
  chalk.yellow(
    figlet.textSync('Flow Log Reader', { horizontalLayout: 'full' })
  )
);

let getFlowLog = require('../index.js').main
let filter = require('../flow_parse.js').input
switch(process.argv[2]){
    case "get":
        getFlowLog();
        break;
    case "parse":
        filter();
        break;
    default:
        console.log("Invalid command.")
}