#!/bin/env node

import * as dotenv from "dotenv";
dotenv.config();

process.env.LOGFILE = process.argv.slice(2).join("-");
import log from "lib/Logger";
// console.log(process.env.LOGFILE);
import patreonDL from "commands/patreon-dl";
import { getFailedFromLogs } from "commands/patreon-dl/get-failed";
import { isKeyOf } from "utils/ts-utils";

const COMMANDS = {
  "patreon-dl": patreonDL,
  "get-failed": getFailedFromLogs,
};

// check if command exists
const command = process.argv[2];
if (!isKeyOf(command, COMMANDS)) {
  log.err(`Command "${command}" not found.`);
  process.exit(1);
}

// run
log.blue(`running`, command);
COMMANDS[command]();

