import path from "path";
import log from "../lib/Logger.js";

// Check if file path is provided
if (process.argv.length < 3) {
  log.err("Please provide the file path.");
  process.exit(1);
}

export default async function main() {
  // The log file path
  let topLevel;
  try {
    topLevel = path.resolve(process.argv[2]);
  } catch (e) {
    log.err(`Could not resolve path ${process.argv[2]}`);
    process.exit(1);
  }
}
