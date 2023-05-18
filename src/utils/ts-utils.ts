export function isKeyOf<T extends object>(key: any, obj: T): key is keyof T {
  return obj.hasOwnProperty(key);
}
