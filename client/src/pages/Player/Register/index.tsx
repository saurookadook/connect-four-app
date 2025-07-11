import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { FlexColumn } from '@/layouts';
import { useAppStore } from '@/store';
import { registerNewPlayer } from '@/store/actions';
import { BaseInput } from '../components';
import { getFormData } from '../utils';

// 🔒 🔓
export function Register() {
  const navigate = useNavigate();
  const { appDispatch } = useAppStore();
  const formRef = useRef<HTMLFormElement>(null);

  function handleOnSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const {
      username, // force formatting
      password,
      confirmPassword,
    } = getFormData(event.target as HTMLFormElement);

    // TODO: add further error/invalid handling
    if (password.value !== confirmPassword.value) {
      // @ts-expect-error: TypeScript doesn't like this :]
      formRef.current.elements['confirm-password'].setCustomValidity(
        'Password fields must be identical.',
      );
      return;
    }

    return registerNewPlayer({
      dispatch: appDispatch,
      username: username.value,
      password: password.value,
    }).then((actionResult) => {
      if (actionResult.statusCode >= 400) {
        console.error(`Registration failed: ${actionResult.message}`);
        return;
      }

      return navigate('/connect-four');
    });
  }

  return (
    <div id="register">
      <h2>{`Connect Four: New Player Registration`}</h2>

      <form
        onSubmit={handleOnSubmit}
        ref={formRef}
        // NOTE: `role` is only needed until a bug in testing-library is fixed
        // - https://github.com/testing-library/dom-testing-library/issues/1293
        role="form"
      >
        <FlexColumn>
          <label htmlFor="username">Username</label>
          <BaseInput
            type="text" // force formatting
            id="username"
            name="username"
            maxLength={24}
          />

          <label htmlFor="password">Password</label>
          <BaseInput
            type="password" // force formatting
            id="password"
            name="password"
            minLength={8}
            maxLength={30}
          />

          <label htmlFor="confirm-password">Confirm Password</label>
          <BaseInput
            type="password" // force formatting
            id="confirm-password"
            name="confirm-password"
            minLength={8}
            maxLength={30}
          />

          <button type="submit">Register</button>
        </FlexColumn>
      </form>
    </div>
  );
}
