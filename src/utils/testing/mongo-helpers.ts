import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

// TODO: would be great to generate this somehow based on a schema?
export const dateFields = new Set(['createdAt', 'updatedAt']);

export function expectHydratedDocumentToMatch<T>(
  documentUnderTest: HydratedDocument<T>,
  expected: Partial<T> & { _id?: ObjectId },
): void {
  expect(documentUnderTest).not.toBeNull();
  expect(documentUnderTest._id).toEqual(expect.any(ObjectId));
  for (const [key, value] of Object.entries(expected)) {
    if (dateFields.has(key)) {
      expect(documentUnderTest[key]).toEqual(expect.any(Date));
    } else {
      expect(documentUnderTest[key]).toEqual(value);
    }
  }
}
