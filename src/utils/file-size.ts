import { stat } from "utils/fs-util";
import { CustomError, catchError } from "./error-handler.js";
import { roundToPlaces } from "utils/math";

interface FileComparisonResult {
  big: string;
  small: string;
}

export async function compareFileSize(
  filePath1: string,
  filePath2: string
): Promise<FileComparisonResult | Error> {
  const stats1 = await stat(filePath1);
  if (stats1 instanceof Error) return stats1;
  const stats2 = await stat(filePath2);
  if (stats2 instanceof Error) return stats2;

  if (stats1.size > stats2.size) {
    return {
      big: filePath1,
      small: filePath2,
    };
  }
  return {
    big: filePath2,
    small: filePath1,
  };
}

export async function getFileSizeInMB(filePath: string): Promise<Error | number | null> {
  return catchError<number | null | CustomError>(async () => {
    const stats = await stat(filePath);
    if (stats instanceof CustomError) return stats;
    const fileSizeInBytes = stats.size;
    const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Convert to megabytes
    return roundToPlaces(fileSizeInMB, 2); // Return the size rounded to 2 decimal places
  }, "Error getting File size:");
}
