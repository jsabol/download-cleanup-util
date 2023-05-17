import path from "path";
import { readdir, isDirectory } from "utils/fs-util";
import log from "lib/Logger";

interface FindFilesOptions {
  types: string[];
  exclude: RegExp[];
  include: RegExp[];
}

export const printTypes = (types: string[], result: { [key: string]: string[] }) =>
  types.map((key) => `${key}: ${(result as any)[key].length}`).join(" | ");

export async function findFilesOfTypes(
  directoryPath: string,
  opt: FindFilesOptions = {
    exclude: [],
    include: [],
    types: [],
  },
  result?: { [key: string]: string[] }
) {
  log.blue("findFilesOfTypes", directoryPath);
  if (!result) {
    result = {};
    opt.types.forEach((type) => {
      (result as any)[type] = [];
    });
  }

  const files = await readdir(directoryPath);
  if (files instanceof Error) return files;

  const promises = files.map(async (file: string) => {
    const filePath = path.join(directoryPath, file);
    if (opt.exclude.length && opt.exclude.some((regex) => regex.test(filePath))) {
      return;
    }
    if (opt.include.length && !opt.include.some((regex) => regex.test(filePath))) {
      return;
    }

    if (await isDirectory(filePath)) {
      await findFilesOfTypes(filePath, opt, result);
    } else {
      const extension = path.extname(file).toLowerCase();
      if (opt.types.includes(extension)) {
        (result as any)[extension].push(filePath);
        if (result) log.up(printTypes(opt.types, result));
      }
    }
  });
  await Promise.all(promises);
  return result;
}
