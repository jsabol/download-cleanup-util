import { readStringFile } from "utils/fs-util";

export function getFailed(log: string) {
  const failedFiles = new Set<string>();
  const lines = log.split("\n");
  lines.forEach((line) => {
    const failMatch = line.match(
      /^\d*-\d*-\d* [\d:.]* ERROR Failed to download (.*?): Error while downloading .*/
    );
    if (failMatch) failedFiles.add(failMatch[1]);
  });
  console.log(`Failed files: ${failedFiles.size}`);
}

export async function getFailedFromLogs(patreon?: string) {
  patreon = process.argv[3] || patreon;
  const content = await readStringFile(`logs/patreon-downloader-${patreon}.txt`);
  if (content instanceof Error) {
    console.error(content);
    return;
  }
  return getFailed(content);
}
