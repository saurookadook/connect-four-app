import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

// TODO: would be great to generate this somehow based on a schema?
export const dateFields = new Set(['createdAt', 'updatedAt']);

export function expectHydratedDocumentToMatch<T>(
  documentUnderTest: HydratedDocument<T>,
  expected: { _id?: Types.ObjectId; __v?: number } & Partial<T>,
): void {
  expect(documentUnderTest).not.toBeNull();
  expect(documentUnderTest).toHaveProperty('_id', expect.any(Types.ObjectId));

  for (const [key, value] of Object.entries(expected)) {
    if (dateFields.has(key)) {
      expect(documentUnderTest).toHaveProperty(key, expect.any(Date));
    } else if (key === '__v') {
      expect(documentUnderTest).toHaveProperty(key, expect.any(Number));
    } else {
      expect(documentUnderTest).toHaveProperty(key, value);
    }
  }
}

export function expectSerializedDocumentToMatch<T>(
  documentUnderTest: Partial<T>,
  expected: Partial<T> & { id?: string },
): void {
  expect(documentUnderTest).not.toBeNull();
  expect(documentUnderTest).toHaveProperty('id', expect.any(String));

  for (const [key, value] of Object.entries(expected)) {
    if (dateFields.has(key)) {
      expect(documentUnderTest).toHaveProperty(key);
      expect(documentUnderTest[key]).toBeISODateString();
    } else {
      expect(documentUnderTest).toHaveProperty(key, value);
    }
  }
}
