import { spawn } from "child_process";
import { CustomError } from "./error-handler";
import chalk from "chalk";
import kill from "tree-kill";

interface CommandResult {
  stdout: string;
  stderr: string;
}

function go(command: string, cwd: string, timeoutSec: number): Promise<CommandResult> {
  console.log(command);

  return new Promise((resolve) => {
    const childProcess = spawn(command, {
      shell: true,
      cwd,
      stdio: ["inherit", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    let timeout = setTimeout(() => {
      if (childProcess.pid) kill(childProcess.pid);
      else childProcess.kill();
      console.error(chalk.red(`Command '${command}' timed out after ${timeoutSec} seconds`));
      resolve({ stdout, stderr });
    }, timeoutSec * 1000);

    childProcess.stdout?.on("data", (data) => {
      const line = data.toString();
      stdout += line;
      if (line.includes(" WARN ")) {
        console.log(chalk.magenta(line.trim()));
      } else if (line.includes(" ERROR ")) {
        console.log(chalk.yellow(line.trim()));
      } else console.log(line.trim());

      // Reset the timeout when receiving output
      timeout.refresh();
    });

    childProcess.stderr?.on("data", (data) => {
      stderr += data.toString().trim();
      console.error(chalk.red(data.toString().trim()));

      // Reset the timeout when receiving output
      timeout.refresh();
    });

    childProcess.on("close", (code) => {
      clearTimeout(timeout);

      if (code !== 0) {
        console.error(new Error(`Command '${command}' exited with code ${code}`));
      }
      resolve({ stdout, stderr });
    });

    childProcess.on("error", (error) => {
      clearTimeout(timeout);
      if (childProcess.pid) kill(childProcess.pid);
      else childProcess.kill();
      console.error(chalk.red(`Command '${command}' failed with error: ${error}`));
      resolve({ stdout, stderr });
    });
  });
}

export default async function runCommand(
  command: string,
  cwd = process.cwd(),
  timeoutSec = 10
): Promise<{ stderr: string; stdout: string }> {
  const { stdout, stderr } = await go(command, cwd, timeoutSec);
  return { stdout, stderr };
}
