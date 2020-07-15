#!/usr/bin/env node

const readline = require("readline-sync");
let getFlowLog = require('../index.js').main
let parse = require('../flow_parse.js').input
switch(process.argv[2]){
    case "get":
        getFlowLog()
        break
    case "parse":
        parse()
        break
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