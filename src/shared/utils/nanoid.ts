import { nanoid } from 'nanoid';

export function generateNanoId(size = 7) {
  return nanoid(size);
}
