# acl-logs

When traffic is denied to a VPC by ACLs or security groups, the only way to investigate is to look at flow logs. Currently, flow logs are hard to read and manage. We are going to build a tool that runs SQL queries on the logs to generate important information in a readable format.

## Instructions

- Must have node js installed.

- Install node js with `brew install node`.

- Run `npm install readline-sync` in the project directory. This package allows an easy way to obtain user input.
- Run `npm install axios ibm-cos-sdk qs` in the project directory
- Run `npm install chalk clear figlet` in the project directory

- Use `npm install -g .` to package the program as a global command
- Use `flowlog get` to pull the newest flowlogs
- Use `flowlog parse` to parse the flowlogs

## How to get your API Key
- Log in to to cloud.ibm.com
- Click "Manage" in the top right menu bar
- Select "Access (IAM)"
- Select "API keys" on the left menu
- You can create a API key in this page, and make sure to store it securely