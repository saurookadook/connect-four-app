import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockFirstPlayer } from '@/__mocks__/playerMocks';
import { createFetchMock, WithMemoryRouter } from '@/utils/testing';
import {
  expectLoginFormToBeCorrectAndVisible, // force formatting
  getInput,
} from '../testUtils';

function LoginWithRouter() {
  return <WithMemoryRouter initialEntries={['/login']} />;
}

describe('Login Page', () => {
  // @ts-expect-error: I know the type doesn't match exactly but that's ok :]
  const fetchMock = vi.spyOn(window, 'fetch').mockImplementation(createFetchMock());

  afterEach(() => {
    fetchMock.mockClear();
  });

  it('render the Login page', async () => {
    render(<LoginWithRouter />);

    expect(
      await screen.findByRole('heading', {
        level: 2,
        name: 'Connect Four: Player Login',
      }),
    ).toBeVisible();

    const formEl = await screen.findByRole('form');
    expectLoginFormToBeCorrectAndVisible(formEl);
  });

  describe('form submission', () => {
    beforeEach(() => {
      cleanup();
    });

    it('handles valid form submissions', async () => {
      const user = userEvent.setup();
      const { container } = render(<LoginWithRouter />);

      expect(
        await screen.findByRole('heading', {
          level: 2,
          name: 'Connect Four: Player Login',
        }),
      ).toBeVisible();

      const formEl = await screen.findByRole('form');
      expectLoginFormToBeCorrectAndVisible(formEl);

      const usernameInput = getInput(formEl, 'Username');
      const passwordInput = getInput(formEl, 'Password');

      await user.type(usernameInput, mockFirstPlayer.username);
      await user.type(passwordInput, mockFirstPlayer.unhashedPassword);

      // await user.click(getButtonByRole(formEl, 'Register'));
      fireEvent.submit(formEl);

      let connectFourPage;
      await waitFor(() => {
        connectFourPage = container.querySelector('section#connect-four');
        expect(connectFourPage).not.toBeNull();
      });

      expect(connectFourPage).toBeVisible();
    });

    it('handles unregistered player', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error');
      const user = userEvent.setup();
      render(<LoginWithRouter />);

      expect(
        await screen.findByRole('heading', {
          level: 2,
          name: 'Connect Four: Player Login',
        }),
      ).toBeVisible();

      const formEl = await screen.findByRole('form');
      expectLoginFormToBeCorrectAndVisible(formEl);

      const usernameInput = getInput(formEl, 'Username');
      const passwordInput = getInput(formEl, 'Password');

      await user.type(usernameInput, 'testuser');
      await user.type(passwordInput, 'password123');

      // await user.click(getButtonByRole(formEl, 'Register'));
      fireEvent.submit(formEl);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Login failed: Invalid username or password.');
      });
    });
  });
});
