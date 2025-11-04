import { Prisma } from '@prisma/client';

export function serializeJsonMedia(
  media: string[] | undefined | null,
): Prisma.InputJsonValue | undefined | typeof Prisma.JsonNull {
  if (media === undefined) {
    return undefined; 
  }
  if (media === null) {
    return Prisma.JsonNull; 
  }
  return JSON.stringify(media);
}


export function deserializeJsonMedia(media: Prisma.JsonValue): string[] {
  if (media === null) return [];
  try {
    return JSON.parse(media as string) as string[];
  } catch {
    return [];
  }
}