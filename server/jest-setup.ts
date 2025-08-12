import {
  toBeISODateString,
  toBeNullish,
  toBeStringIncluding,
  toBeUUID,
} from '@connect-four-app/shared';

expect.extend({
  toBeISODateString,
  toBeNullish,
  toBeStringIncluding,
  toBeUUID,
});
