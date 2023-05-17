import log from "../lib/Logger";

export class CustomError extends Error {
  originalError: any;
  constructor(message: string, originalError: any) {
    super(message);
    if (originalError instanceof Error) {
      this.name = originalError.name || this.name;
      this.stack = originalError.stack || this.stack;
      this.message = originalError.message || this.message;
    }
    this.message = message + ` ` + originalError;
    this.originalError = originalError;
  }
}

export class TimeoutError extends Error {
  cause: any;
  constructor(cause: any) {
    super("TimeoutError");
    this.cause = cause;
  }
}

export async function catchError<T>(
  fn: () => Promise<T>,
  errContext = "error"
): Promise<T | CustomError> {
  try {
    const result = await fn();
    if (result instanceof Error) {
      log.red(errContext, "", result);
      return new CustomError(errContext, result);
    }
    return result;
  } catch (e: any) {
    log.red(errContext, "", e);
    return new CustomError(errContext, e);
  }
}
