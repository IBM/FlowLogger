#!/usr/bin/env node
const version = "1.0.0";
const readline = require("readline-sync");
const figlet = require("figlet");
const chalk = require("chalk");

console.log(
  chalk.yellow(figlet.textSync("Flowlogger", { horizontalLayout: "full" }))
);

const getFlowLog = require("../index.js").main;
const parse = require("../flow_parse.js").input;
const getLogErrors = require("../backend/getLogErrors.js");
const clearLogs = require("../functions/clearLogs.js").clearLogs;
const { loadENV } = require("../backend/getFlowLogs"); 
const filter1 = require("../log_select.js");
function printHelp() {
  let overview = "OVERVIEW: \n\t";
  let overview_description =
    "Flowlog CLI can retrieve flow logs from COS buckets and save to your local logs folder. " +
    "It can format, filter and analyze flow logs for more readability. \n";
  let usage = "\nUSAGE:  \n\t";
  let usage_description = "-flowlog\n\t-flowlog <command> \n";
  let version_description = "\nVERSION: \n\t";
  let commands = "\nCOMMANDS: \n\t";
  let commands_description =
    "-flowlog get, follow the prompt to retrieve flow logs from available COS buckets that are associated with flow log collectors. \n" +
    "\t-flowlog parse, select an option between parsing and printing the logs by different attributes or to print the logs into a new file \n" +
    "\t-flowlog scan, detects any actions that were rejected from the flow logs stored locally \n" +
    "\t-flowlog filter, lets you filter all of the flow logs in an entire folder by attributes or time interval \n";
  console.log(
    overview.bold +
      overview_description +
      usage.bold +
      usage_description +
      version_description.bold +
      version +
      "\n" +
      commands.bold +
      commands_description
  );
}
const main = async function() {
  do {
    var option = readline.question(`choose option
        1. (get) newest flowlogs
        2. (Parse) flowlogs stored
        3. (scan) check for errors
        4. (clear) delete flowlogs
        5. (filter) through log folder
        6. (load) enviromental variables
        q. exit
        \n`);
    console.log(option);
    switch (option) {
      case "1":
      case "get":
      case "Get":
        await getFlowLog();
        break;
      case "2":
      case "parse":
      case "Parse":
        parse();
        break;
      case "3":
      case "scan":
      case "Scan":
        getLogErrors();
        break;
      case "4":
      case "clear":
      case "Clear":
        clearLogs();
        break;
      case "5":
      case "filter":
      case "Filter":
        filter1.main();
        break;
    case "6":
      case "load":
      case "Load":
       loadENV();
        break;
 
      case "q":
        console.log("exiting...\n\n\n\n\n");
        option = -1;
        break;
      default:
        console.log("invalid option\n");
    }
  } while (option != -1);
};
switch (process.argv[2]) {
  case "get":
    getFlowLog();
    break;
  case "parse":
    parse();
    break;
  case "scan":
    getLogErrors();
    break;
  case "clear":
    clearLogs();
    break;
  case "filter":
    filter1.main();
    break;
  case 'load':
      loadENV();
  case "-v":
    console.log("flowlog version: " + version);
    break;
  case "-help":
  case "-h":
    printHelp();
    break;
  default:
    main();
}
