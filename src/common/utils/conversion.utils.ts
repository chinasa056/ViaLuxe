import { Prisma } from '@prisma/client';

/**
 * Recursively converts an object, changing `null` values to `undefined`.
 * This is useful for cleaning Prisma return objects for DTOs by converting `null` to `undefined`.
 * It handles nested objects and arrays, but correctly ignores Date objects.
 */
export function convertPrismaToDTO<T extends Record<string, any>>(obj: T): any {
  if (!obj) return obj;

  const converted: any = { ...obj };

  for (const key in converted) {
    if (converted[key] === null) {
      converted[key] = undefined;
    } else if (Array.isArray(converted[key])) {
      converted[key] = converted[key].map((item: any) =>
        typeof item === 'object' && item !== null && !(item instanceof Date)
          ? convertPrismaToDTO(item)
          : item === null
          ? undefined
          : item,
      );
    } else if (
      typeof converted[key] === 'object' &&
      converted[key] !== null &&
      !(converted[key] instanceof Date)
    ) {
      converted[key] = convertPrismaToDTO(converted[key]);
    }
  }

  return converted;
}

/**
 * Recursively converts ISO date strings in an object to Date objects.
 * This is useful for deserializing data from a cache (like Redis)
 * where Date objects have been stringified.
 * @param obj The object to process.
 */
export function convertCacheToDTO<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertCacheToDTO(item)) as any;
  }

  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
        newObj[key] = new Date(value);
      } else if (typeof value === 'object') {
        newObj[key] = convertCacheToDTO(value);
      } else {
        newObj[key] = value;
      }
    }
  }
  return newObj as T;
}