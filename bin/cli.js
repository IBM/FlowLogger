#!/usr/bin/env node

const readline = require("readline-sync");
const figlet = require("figlet");
const chalk = require("chalk");

console.log(
    chalk.yellow(
      figlet.textSync('Flowlogger', { horizontalLayout: 'full' })
    )
);

let getFlowLog = require('../index.js').main;
let parse = require('../flow_parse.js').input;
let getLogErrors = require('../backend/getLogErrors.js');
switch(process.argv[2]){
    case "get":
        getFlowLog()
        break
    case "parse":
        parse()
        break
    case "scan":
        getLogErrors()
        break
    default:
        do{
            var option = readline.question(`choose option
            1. (get) newest flowlogs
            2. (Parse) flowlogs stored
            3. (scan) check for errors
            q. exit
            \n`);
            console.log(option)
            switch (option) {
                case "1": case "get": case "Get":
                    getFlowLog()
                    break
                case "2": case "parse": case "Parse":
                    parse()
                    break
                case "3": case "scan": case "Scan":
                    getLogErrors()
                    break
                case "q": 
                    console.log("exiting...\n\n\n\n\n");
                    option = -1
                    break;
                default:
                    console.log("invalid option\n");
            }
        } while (option != -1);
}