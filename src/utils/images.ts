import sharp from "sharp";

export async function checkFileValidity(filePath: string): Promise<boolean | sharp.Metadata> {
  try {
    const result = await sharp(filePath)
      .metadata()
      .catch(() => {
        return false;
      });
    return result;
  } catch (error) {
    return false; // WebP file is invalid or not supported
  }
}
