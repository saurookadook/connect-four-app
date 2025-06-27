import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';

// TODO: would be great to generate this somehow based on a schema?
export const dateFields = new Set(['createdAt', 'updatedAt']);

export function expectHydratedDocumentToMatch<T>(
  documentUnderTest: HydratedDocument<T>,
  expected: Partial<T> & { _id?: Types.ObjectId },
): void {
  expect(documentUnderTest).not.toBeNull();
  expect(documentUnderTest).toHaveProperty('_id', expect.any(Types.ObjectId));

  for (const [key, value] of Object.entries(expected)) {
    if (dateFields.has(key)) {
      expect(documentUnderTest).toHaveProperty(key, expect.any(Date));
    } else {
      expect(documentUnderTest).toHaveProperty(key, value);
    }
  }
}
