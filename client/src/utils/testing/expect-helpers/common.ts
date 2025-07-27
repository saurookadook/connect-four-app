import { type Screen } from '@testing-library/react';

export async function expectHeadingToBeVisible({
  screenRef,
  level = 2,
  name = /Connect Four/,
}: {
  screenRef: Screen;
  level?: number;
  name?: RegExp | string;
}) {
  const headingEl = await screenRef.findByRole('heading', {
    level,
    name,
  });

  expect(headingEl).toBeVisible();
}
