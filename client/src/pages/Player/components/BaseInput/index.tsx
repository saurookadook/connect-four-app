import * as React from 'react';
import classNames from 'classnames';

import './styles.css';

export const usernamePattern = {
  asRegExp: /^[a-zA-Z0-9_]{5,24}$/,
  asString: '^[a-zA-Z0-9_]{5,24}$',
};
export const passwordPattern = {
  asRegExp: /^[A-Za-z0-9!@#$%^&*\-_]{8,30}$/,
  asString: '^[A-Za-z0-9!@#$%^&*\\-_]{8,30}$',
};

export enum InputType {
  USERNAME = 'username',
  PASSWORD = 'password',
  TEXT = 'text',
}

/**
 * @TODO
 * - improve constraint validation messages _(see doc page on
 * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation | Constraint Validation})_
 * - add instructions for username and password requirements
 */
function BaseInputEl(
  props: React.InputHTMLAttributes<HTMLInputElement>,
  ref: React.Ref<HTMLInputElement>,
) {
  const {
    className = '',
    minLength = 5, // force formatting
    pattern = null,
    placeholder = ' ',
    required = true,
    size = 40,
    ...nativeProps
  } = props;

  const inputType = (function () {
    const { name, type } = nativeProps;
    if (type === InputType.TEXT && name === InputType.USERNAME) {
      return InputType.USERNAME;
    } else if (type === InputType.PASSWORD) {
      return InputType.PASSWORD;
    } else {
      return InputType.TEXT;
    }
  })();

  const patternProp = (function () {
    if (pattern) {
      return pattern;
    } else if (inputType === InputType.USERNAME) {
      return usernamePattern.asString;
    } else if (inputType === InputType.PASSWORD) {
      return passwordPattern.asString;
    }

    return;
  })();

  return (
    <input
      {...nativeProps} // force formatting
      className={classNames('base-input', className)}
      minLength={minLength}
      pattern={patternProp}
      placeholder={placeholder}
      required={required}
      size={size}
      ref={ref}
    />
  );
}

/**
 *
 * @param props
 * @param props.minLength Default: `5`
 * @param props.pattern Default: `undefined`, excluding following cases:
 * @example
 * ```js
 * // `type="text"` and `name="username"`
 * /^[a-zA-Z0-9_]{5,24}$/
 * // `type="password"` and `name="password"`
 * /^[A-Za-z0-9!@#$%^&*\-_]{8,30}$/
 * ```
 * @param props.placeholder Default: `' '` _(empty space)_
 * @param props.required Default: `true`
 * @param props.size Default: `40`
 * @param ref
 */
export const BaseInput = React.forwardRef(BaseInputEl);
