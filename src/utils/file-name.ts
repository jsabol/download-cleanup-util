export function cleanFilename(filename: string): string {
  // Remove or replace invalid characters
  const invalidCharsRegex = /[/\\?%*:|"<>]/g; // Invalid characters: / \ ? % * : | " < >
  const cleanFilename: string = filename.replace(invalidCharsRegex, "-");

  // Trim whitespace and dots at the beginning/end of the filename
  const trimmedFilename: string = cleanFilename.trim().replace(/^[.\s]+|[.\s]+$/g, "");

  return trimmedFilename;
}
