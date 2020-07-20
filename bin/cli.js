#!/usr/bin/env node

const readline = require("readline-sync");
let getFlowLog = require('../index.js').main;
let parse_f = require('../flow_parse.js');//.input;
let getLogErrors = require('../backend/getLogErrors.js');
switch(process.argv[2]){
    case "get":
        getFlowLog()
        break
    case "parse":
        parse_f.input
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
            \n`);
            console.log(option)
            switch (option) {
                case "1": case "get": case "Get":
                    getFlowLog()
                    break
                case "2": case "parse": case "Parse":
                    parse_f()
                    break
                case "3": case "scan": case "Scan":
                    getLogErrors()
                    break
                case "4": 
                    option = -1
                    break;
                default:
                    console.log("invalid option\n");
            }
        } while (option != -1);
}