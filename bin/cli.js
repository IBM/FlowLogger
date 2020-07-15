#!/usr/bin/env node
<<<<<<< HEAD
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

=======

const readline = require("readline-sync");
>>>>>>> fb757f56cebad9082beee0451933e3bba81a6d3a
let getFlowLog = require('../index.js').main
let parse = require('../flow_parse.js').input
switch(process.argv[2]){
    case "get":
<<<<<<< HEAD
        getFlowLog();
        break;
    case "parse":
        filter();
        break;
=======
        getFlowLog()
        break
    case "parse":
        parse()
        break
>>>>>>> fb757f56cebad9082beee0451933e3bba81a6d3a
    default:
        do{
            var option = readline.question(`choose option
            1. (get) newest flowlogs
            2. (Parse) flowlogs stored
            3. (exit)
            \n`);
            console.log(option)
            switch (option) {
                case "1": case "get": case "Get":
                    getFlowLog()
                    break
                case "2": case "parse": case "Parse":
                    parse()
                    break
                case "3":
                    option = -1
                    break;
                default:
                    console.log("invalid option\n");
            }
        } while (option != -1);
}