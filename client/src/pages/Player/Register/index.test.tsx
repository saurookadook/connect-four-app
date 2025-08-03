import renderWithContext from '#saurookkadookk/react-utils-render-with-context';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  afterAll, // force formatting
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { sharedLog } from '@connect-four-app/shared';
import { mockFirstPlayer } from '@/__mocks__/playerMocks';
import { AppStateProvider } from '@/store';
import {
  createFetchMock,
  expectHeadingToBeVisible,
  WithMemoryRouter,
} from '@/utils/testing';
import {
  expectRegisterFormToBeCorrectAndVisible, // force formatting
  getInput,
} from '../testUtils';
import { Register } from '.';

const logger = sharedLog.getLogger(Register.name);

function RegisterWithRouter() {
  return <WithMemoryRouter initialEntries={['/account/register']} />;
}

describe('Register Page', () => {
  // @ts-expect-error: I know the type doesn't match exactly but that's ok :]
  const fetchMock = vi.spyOn(window, 'fetch').mockImplementation(createFetchMock());
  const loggerErrorSpy = vi
    .spyOn(logger, 'error')
    .mockImplementation((...args) => args);

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  afterAll(() => {
    fetchMock.mockRestore();
    vi.clearAllMocks();
  });

  it('renders correctly', async () => {
    renderWithContext(
      <RegisterWithRouter />, // force formatting
      AppStateProvider,
    );

    await expectHeadingToBeVisible({
      screenRef: screen,
      level: 2,
      name: 'Connect Four: New Player Registration',
    });

    const formEl = await screen.findByRole('form');
    expectRegisterFormToBeCorrectAndVisible(formEl);
  });

  describe('form submission', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      cleanup();
    });

    it('handles valid form submissions', async () => {
      const { container, user } = renderWithContext(
        <RegisterWithRouter />,
        AppStateProvider,
      );

      await expectHeadingToBeVisible({
        screenRef: screen,
        level: 2,
        name: 'Connect Four: New Player Registration',
      });

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
        connectFourPage = container.querySelector('section#game-sessions-history');
        expect(connectFourPage).not.toBeNull();
      });

      expect(connectFourPage).toBeVisible();
    });
  });

  describe('invalid form submission', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      cleanup();
    });

    it("handles username that's too short", async () => {
      const { user } = renderWithContext(
        <RegisterWithRouter />, // force formatting
        AppStateProvider,
      );

      await expectHeadingToBeVisible({
        screenRef: screen,
        level: 2,
        name: 'Connect Four: New Player Registration',
      });

      const formEl = await screen.findByRole('form');
      expectRegisterFormToBeCorrectAndVisible(formEl);

      const usernameInput = getInput(formEl, 'Username');
      const passwordInput = getInput(formEl, 'Password');
      const confirmPasswordInput = getInput(formEl, 'Confirm Password');

      await user.type(usernameInput, 'Ken');
      await user.type(passwordInput, mockFirstPlayer.unhashedPassword);
      await user.type(confirmPasswordInput, mockFirstPlayer.unhashedPassword);

      // await user.click(getButtonByRole(formEl, 'Register'));
      fireEvent.submit(formEl);

      expect(usernameInput.validationMessage).toEqual(
        'Username must be at least 5 characters long.',
      );
    });

    it("handles password that's too short", async () => {
      const { user } = renderWithContext(
        <RegisterWithRouter />, // force formatting
        AppStateProvider,
      );

      await expectHeadingToBeVisible({
        screenRef: screen,
        level: 2,
        name: 'Connect Four: New Player Registration',
      });

      const formEl = await screen.findByRole('form');
      expectRegisterFormToBeCorrectAndVisible(formEl);

      const usernameInput = getInput(formEl, 'Username');
      const passwordInput = getInput(formEl, 'Password');
      const confirmPasswordInput = getInput(formEl, 'Confirm Password');

      await user.type(usernameInput, mockFirstPlayer.username);
      await user.type(passwordInput, 'toosmol');
      await user.type(confirmPasswordInput, mockFirstPlayer.unhashedPassword);

      // await user.click(getButtonByRole(formEl, 'Register'));
      fireEvent.submit(formEl);

      expect(passwordInput.validationMessage).toEqual(
        'Password must be at least 8 characters long.',
      );
    });

    it.skip("handles password that doesn't meet character requirements", async () => {
      const { user } = renderWithContext(
        <RegisterWithRouter />, // force formatting
        AppStateProvider,
      );

      await expectHeadingToBeVisible({
        screenRef: screen,
        level: 2,
        name: 'Connect Four: New Player Registration',
      });

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

      expect(passwordInput.validationMessage).toEqual(
        'Password field must be include TODO',
      );
    });

    it('handles password mismatched with confirm password', async () => {
      const { user } = renderWithContext(
        <RegisterWithRouter />, // force formatting
        AppStateProvider,
      );

      await expectHeadingToBeVisible({
        screenRef: screen,
        level: 2,
        name: 'Connect Four: New Player Registration',
      });

      const formEl = await screen.findByRole('form');
      expectRegisterFormToBeCorrectAndVisible(formEl);

      const usernameInput = getInput(formEl, 'Username');
      const passwordInput = getInput(formEl, 'Password');
      const confirmPasswordInput = getInput(formEl, 'Confirm Password');

      await user.type(usernameInput, mockFirstPlayer.username);
      await user.type(passwordInput, mockFirstPlayer.unhashedPassword);
      await user.type(confirmPasswordInput, mockFirstPlayer.unhashedPassword + 'asdf');

      // await user.click(getButtonByRole(formEl, 'Register'));
      fireEvent.submit(formEl);

      expect(confirmPasswordInput.validationMessage).toEqual(
        'Password fields must be identical.',
      );
    });
  });
});
