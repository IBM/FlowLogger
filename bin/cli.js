#!/usr/bin/env node

const readline = require("readline-sync");
const figlet = require("figlet");
const chalk = require("chalk");

console.log(
    chalk.yellow(
      figlet.textSync('Flowlogger', { horizontalLayout: 'full' })
    )
);

function printHelp()
{
    let overview = "OVERVIEW: \n";
    let overview_description = "Flowlog CLI can retrieve flow logs from COS buckets and save to your local logs folder. " +
    "It can format, filter and analyze flow logs for more readability. \n";
    let usage = "USAGE:  \n";
    let usage_description = "-flowlog\n-flowlog <command> \n";
    let version = "VERSION: \n";
    let version_description = "beta testing \n"
    let commands = "COMMANDS: \n";
    let commands_description =  "-flowlog get, follow the prompt to retrieve flow logs from available COS buckets that are associated with Flow log collectors. \n" + 
        "-flowlog parse, select an option between parsing and printing the logs by different attributes or to print the logs into a new file \n" +
        "-flowlog scan, detects any actions that were rejected from the flow logs stored locally \n" ;
    console.log(overview.bold + overview_description + usage.bold + usage_description + version.bold + version_description +
       commands.bold + commands_description); 
}

let getFlowLog = require('../index.js').main;
let parse = require('../flow_parse.js').input;
let getLogErrors = require('../backend/getLogErrors.js');
const main = async function () {
    do{
        var option = readline.question(`choose option
        1. (get) newest flowlogs
        2. (Parse) flowlogs stored
        3. (scan) check for errors
        4. (help) give more info 
        q. exit
        \n`);
        console.log(option)
        switch (option) {
            case "1": case "get": case "Get":
                await getFlowLog()
                break
            case "2": case "parse": case "Parse":
                parse()
                return
            case "3": case "scan": case "Scan":
                getLogErrors()
                break
            case "4": case "help": case "Help":
                printHelp()
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
    case "help":
        printHelp()
        break
    default:
        main()
}