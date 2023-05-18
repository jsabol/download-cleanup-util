import { cleanFilename } from "utils/file-name.js";
import logUpdate from "log-update";
import cliSpinner from "cli-spinners";
import chalk from "chalk";
import * as fs from "utils/fs-util";
import path from "path";

class Logger {
  logQueue: string[];
  writing: boolean;
  frame: number;
  frameArr: string[];

  constructor() {
    this.logQueue = [];
    this.writing = false;
    this.frame = 0;
    this.frameArr = cliSpinner.dots.frames;
  }

  async writeLog() {
    if (this.logQueue.length === 0 || this.writing) {
      return;
    }
    this.writing = true;
    const toWrite = this.logQueue.join("\n") + "\n";
    this.logQueue = [];

    await fs.appendFile(this.getLogFilePath(), toWrite);

    if (this.logQueue.length > 0) {
      await this.writeLog();
    }
  }

  getLogFilePath() {
    return path.join(process.cwd(), "logs", cleanFilename(`log-${process.env.LOGFILE}.txt`));
  }

  addToQueue(message: string) {
    this.logQueue.push(message);
    void this.writeLog();
  }

  async clearFile() {
    await fs.writeFile(this.getLogFilePath(), "");
  }

  out(...messages: string[]) {
    const allMessages = messages
      .map((message, index) => {
        const before = index === 0 ? "" : "└─ ";
        return message ? `${before}${message}` : "";
      })
      .join("\n");

    logUpdate.done();
    console.log(allMessages);
    logUpdate.done();
    this.addToQueue(allMessages);
  }

  err(...message: any[]) {
    const allMessages = message
      .map((m, i) => {
        const before = i === 0 ? "" : "└─ ";
        if (m instanceof Error) {
          return before + m.toString() + `\n` + m.stack;
        }
        return before + m.toString();
      })
      .join("\n");
    logUpdate.done();
    console.error(allMessages);
    logUpdate.done();
    this.addToQueue(allMessages);
  }

  up(...message: string[]) {
    const frameImg = this.frameArr[(this.frame = ++this.frame % this.frameArr.length)];
    const allMessages = message
      .map((m, i) => {
        const before = i === 0 ? "" : "  └─ ";
        return m && before + m.toString();
      })
      .join("\n");
    logUpdate(`${chalk.blue(frameImg)} ${allMessages}`);
    this.addToQueue(allMessages);
  }

  blue(prefix: string, ...message: string[]) {
    if (message.length > 1) this.up(`${chalk.blue(prefix)} ${message[0]}`, ...message.slice(1));
    else this.up(`${chalk.blue(prefix)} ${message[0]}`);
  }
  green(prefix: string, ...message: string[]) {
    if (message.length > 1) {
      this.out(`${chalk.green("✔ " + prefix)} ${message[0]}`, ...message.slice(1));
    } else this.out(`${chalk.green("✔ " + prefix)} ${message[0]}`);
  }
  red(prefix: string, ...message: any[]) {
    if (message.length > 1) {
      this.err(`${chalk.red("✘ " + prefix)} ${message[0]}`, ...message.slice(1));
    } else this.err(`${chalk.red("✘ " + prefix)} ${message[0]}`);
  }
}

export default new Logger();
