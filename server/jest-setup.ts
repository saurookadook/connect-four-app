import {
  toBeISODateString,
  toBeStringIncluding,
  toBeUUID,
} from '@/utils/testing/matchers';

expect.extend({
  toBeISODateString,
  toBeStringIncluding,
  toBeUUID,
});
