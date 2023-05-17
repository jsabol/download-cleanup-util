import fs from "fs";
import path from "path";
import { rimraf } from "rimraf";

import log from "lib/Logger";
import { catchError, CustomError } from "./error-handler";

export async function deleteFolder(folderPath: string, msg?: string) {
  await rimraf(folderPath);
  if (typeof msg !== "undefined") {
    log.out(`${msg || "DELETED:"} ${folderPath}`);
  }
}

// Makes a directory if it doesn't exist, recursively and asynchronously
export async function mkdir(directoryPath: string, errContext = "error"): Promise<void | Error> {
  return catchError<void | CustomError>(async () => {
    try {
      await fs.promises.mkdir(directoryPath, { recursive: true });
    } catch (error) {
      // already exists
      if (error instanceof Error && error.message.includes("EEXIST")) {
        return;
      }
      return new CustomError(errContext, error);
    }
  }, errContext);
}

// Write a file asynchronously, checking if it's parent directory exists and making it if needed
export async function writeFile(filePath: string, data: string): Promise<void | Error> {
  const parentDirectory = filePath.replace(/\/[^/]*$/, ""); // Extract parent directory path
  const r = await mkdir(parentDirectory);
  if (r instanceof Error) return r;
  await fs.promises.writeFile(filePath, data);
}

export async function readJSONFile(filePath: string, errContext = "error") {
  return catchError<{ [key: string]: any } | false>(async () => {
    const ext = path.extname(filePath);
    if (!(ext === ".json")) {
      return new Error("File is not a JSON file");
    }
    const content = await fs.promises.readFile(filePath, "utf-8");
    try {
      return JSON.parse(content);
    } catch (e) {
      if (e instanceof Error && e.message.includes("Unexpected end of JSON input")) return false;
      return e;
    }
  }, errContext);
}

export function readStringFile(filePath: string, errContext = "error") {
  return catchError<string>(async () => fs.promises.readFile(filePath, "utf-8"), errContext);
}

export function readdir(path: string, errContext = "error") {
  return catchError<string[]>(() => fs.promises.readdir(path), errContext);
}

export function stat(filepath: string, errContext = "error") {
  return catchError<fs.Stats>(() => fs.promises.stat(filepath), errContext);
}

export function exists(filepath: string, errContext = "error") {
  return catchError<boolean | CustomError>(async () => {
    try {
      await fs.promises.stat(filepath);
      return true;
    } catch (e: any) {
      if (e.code === "ENOENT") {
        return false;
      }
      log.red(errContext, `${filepath}`, e);
      return new CustomError(errContext, e);
    }
  }, errContext);
}

export function mustExist(filepath: string, errContext = "error") {
  return catchError<fs.Stats>(() => fs.promises.stat(filepath), errContext);
}

export function rename(oldPath: string, newPath: string, errContext = "error") {
  return catchError<void>(() => fs.promises.rename(oldPath, newPath), errContext);
}

export function copyFile(from: string, to: string, errContext = "error") {
  return catchError<void>(() => fs.promises.copyFile(from, to), errContext);
}

export function isDirectory(filepath: string, errContext = "error") {
  return catchError<boolean | CustomError>(async () => {
    const stats = await stat(filepath);
    if (stats instanceof Error) return stats;
    return stats.isDirectory();
  }, errContext);
}

export function appendFile(filePath: string, message: string, errContext = "error") {
  return catchError<void | CustomError>(async () => {
    const exist = await exists(filePath);
    if (exist instanceof Error) return exist;
    if (!exist) await writeFile(filePath, "");
    return fs.promises.appendFile(filePath, message);
  }, errContext);
}

export function deleteFile(filePath: string, errContext = "error") {
  return catchError<void>(() => fs.promises.unlink(filePath), errContext);
}
