import {
  afterAll, // force formatting
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockFirstPlayer } from '@/__mocks__/playerMocks';
import { createFetchMock, WithMemoryRouter } from '@/utils/testing';
import {
  expectRegisterFormToBeCorrectAndVisible, // force formatting
  getInput,
} from '../testUtils';

function RegisterWithRouter() {
  return <WithMemoryRouter initialEntries={['/register']} />;
}

describe('Register Page', () => {
  // @ts-expect-error: I know the type doesn't match exactly but that's ok :]
  const fetchMock = vi.spyOn(window, 'fetch').mockImplementation(createFetchMock());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    fetchMock.mockRestore();
    vi.clearAllMocks();
  });

  it('renders correctly', async () => {
    render(<RegisterWithRouter />);

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Connect Four: New Player Registration',
      }),
    ).toBeVisible();

    const formEl = await screen.findByRole('form');
    expectRegisterFormToBeCorrectAndVisible(formEl);
  });

  describe('form submission', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      cleanup();
    });

    it('handles valid form submissions', async () => {
      const user = userEvent.setup();
      const { container } = render(<RegisterWithRouter />);

      expect(
        await screen.findByRole('heading', {
          level: 2,
          name: 'Connect Four: New Player Registration',
        }),
      ).toBeVisible();

      const formEl = await screen.findByRole('form');
      expectRegisterFormToBeCorrectAndVisible(formEl);

      const usernameInput = getInput(formEl, 'Username');
      const passwordInput = getInput(formEl, 'Password');
      const confirmPasswordInput = getInput(formEl, 'Confirm Password');

      await user.type(usernameInput, mockFirstPlayer.username);
      await user.type(passwordInput, mockFirstPlayer.unhashedPassword);
      await user.type(confirmPasswordInput, mockFirstPlayer.unhashedPassword);

      // await user.click(getButtonByRole(formEl, 'Register'));
      fireEvent.submit(formEl);

      let connectFourPage;
      await waitFor(() => {
        connectFourPage = container.querySelector('section#connect-four');
        expect(connectFourPage).not.toBeNull();
      });

      expect(connectFourPage).toBeVisible();
    });

    // TODO: add error cases
  });
});
