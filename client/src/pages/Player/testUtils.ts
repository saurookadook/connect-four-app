import { within } from '@testing-library/react';
import { expect } from 'vitest';

export function getButtonByRole(containerRef: HTMLElement, labelText: string) {
  return within(containerRef).getByRole('button', { name: labelText });
}

export function getInput(containerRef: HTMLElement, labelText: string) {
  return within(containerRef).getByLabelText(labelText);
}

function expectUsernameInputToBeCorrectAndVisible(formEl: HTMLElement) {
  const usernameInput = getInput(formEl, 'Username');
  expect(usernameInput).toBeVisible();
  expect(usernameInput).toHaveAttribute('type', 'text');
  // TODO: maybe more details?
}

function expectPasswordInputToBeCorrectAndVisible(
  formEl: HTMLElement,
  labelText: string = 'Password',
) {
  const passwordInput = getInput(formEl, labelText);
  expect(passwordInput).toBeVisible();
  expect(passwordInput).toHaveAttribute('type', 'password');
  // TODO: maybe more assertions?
}

function expectSubmitButtonToBeCorrectAndVisible(
  formEl: HTMLElement,
  labelText: string = 'Submit',
) {
  const submitButton = getButtonByRole(formEl, labelText);
  expect(submitButton).toBeVisible();
  expect(submitButton).toHaveAttribute('type', 'submit');
}

export function expectLoginFormToBeCorrectAndVisible(formEl: HTMLElement) {
  expect(formEl).toBeVisible();

  expectUsernameInputToBeCorrectAndVisible(formEl);
  expectPasswordInputToBeCorrectAndVisible(formEl);
  expectSubmitButtonToBeCorrectAndVisible(formEl, 'Log In');
}

export function expectRegisterFormToBeCorrectAndVisible(formEl: HTMLElement) {
  expect(formEl).toBeVisible();

  expectUsernameInputToBeCorrectAndVisible(formEl);
  expectPasswordInputToBeCorrectAndVisible(formEl);
  expectPasswordInputToBeCorrectAndVisible(formEl, 'Confirm Password');
  expectSubmitButtonToBeCorrectAndVisible(formEl, 'Register');
}
