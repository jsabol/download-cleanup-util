#!/bin/env node
process.env.LOGFILE = "test-script";
import log from "lib/Logger";

log.up("Step 1");
log.up("Step 2");
log.up("Step 3");
log.out("Hello World");
