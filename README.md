# FlowLogger

A command line tool for retrieving and parsing IBM Cloud flow logs.

## Contents

1. [Overview](#overview)
2. [Flow Logs](#flow-logs)
3. [Getting started](#getting-started)
4. [Resources](#resources)

## Overview

When traffic is denied to a VPC by ACLs or security groups, the only way to investigate is to look at flow logs. Currently, flow logs are hard to read and manage. We are going to build a tool that runs SQL queries on the logs to generate important information in a readable format.

_Please note that this plug-in is in the **EXPERIMENTAL** phase and there is no official support at the moment, nor are the current command structures going to be around for very long as they are being constantly modified and tweaked for optimal results before pulling them into our CLI._

## Flow Logs

Capture information about the IP traffic going to and from network interfaces in your VPC and are stored in a Cloud Object Storage(COS) bucket

With this information you are able to:

- Troubleshoot why specific traffic isn't reaching an instance, which helps to diagnose restrictive security group rules.
- Monitor the traffic that is reaching your instance.
- Adhere to compliance regulations
- Determine the overall health of network monitoring
- Assist with root cause analysis.

## Getting started

### IBM Cloud Prerequisites

#### Creating a flow log collector

Prior to creating a flow log collector, ensure that you have met the following prerequisites:

-Make sure that at least one VPC, a subnet, and a virtual server instance exist.
-Make sure that a COS instance with a bucket exists for your flow logs.

    For more details, see our [Resources](#resources) section for a detailed IBM Cloud documentation on IBM Cloud VPCs and Flow Logs.

    Make sure to note the region of the COS that contains your flow logs, considering that is what you are prompted for when the CLI pulls them to your local depository.

#### Terminal Prerequisites

- Must have node js installed.

- Install node js with `brew install node`.
- After cloning the repo, run `cd acl-logs` to change your directory to the project directory.
- Run `npm install` in the project directory.
- Run `sudo npm install -g .` to package the program as a global command

- In the package.json file, under `scripts`, set the `test` attribute value to `jest`
- run `npm test` in terminal to exectue tests

#### Commands

- Use `flowlog get` to pull the newest flowlogs
- Use `flowlog parse` to parse the flowlogs
- Use `flowlog scan` to scan logs for errors
- Alternatively, use `flowlog` to choose from any of the above

#### How to get your API Key

- Log in to to cloud.ibm.com
- Click "Manage" in the top right menu bar
- Select "Access (IAM)"
- Select "API keys" on the left menu
- You can create a API key in this page, and make sure to store it securely

## Resources

- [IBM Virtual Private Cloud](https://cloud.ibm.com/docs/vpc?topic=vpc-getting-started)
- [IBM Flowlogs (Beta)](https://cloud.ibm.com/docs/vpc?topic=vpc-flow-logs&locale=en)
- [IBM Cloud Object Storage](https://cloud.ibm.com/docs/cloud-object-storage?topic=cloud-object-storage-getting-started-cloud-object-storage)
