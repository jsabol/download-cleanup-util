import path from "path";
import runCommand from "utils/run-command";
import { getFailed } from "./patreon-dl/get-failed";
import log from "lib/Logger";
import { writeFile } from "utils/fs-util";

export default async function main() {
  const patreon = process.argv[3] || process.env.PATREON;

  // This makes it hang on trying to download youtube files
  // --filenames-fallback-to-content-type true

  // limiting the file name length is also bad - it will prevent me from knowning if it
  // is duplicate or not
  const command = `PatreonDownloader.App.exe
    --url https://www.patreon.com/${patreon}/posts
    --descriptions
    --json
    --file-exists-action KeepExisting
    --download-directory ${process.env.TEMP_DIR}/${patreon}-RAW
    --use-sub-directories
    --sub-directory-pattern "%PublishedAt% %PostTitle%"
    --max-sub-directory-name-length 50
    --disable-remote-file-size-check true
    --log-save`
    .replaceAll("\n    ", " ")
    .replaceAll("\n", " ");

  const result = await runCommand(command, path.join(__dirname, "..", "patreon-downloader"), 600);
  const { stderr, stdout } = result;

  // cache these to a file
  const logPath = path.join(process.cwd(), `logs`, `patreon-downloader-${patreon}.txt`);
  const success = await writeFile(logPath, stdout + `\n` + stderr);
  if (success instanceof Error) log.red("failed", `to save logs to ${logPath}`, success);
  else log.green("saved", `logs to ${logPath}`);

  log.out("getting failed stderr");
  await getFailed(stderr);
  log.out("getting failed stdout");
  await getFailed(stdout);
}
