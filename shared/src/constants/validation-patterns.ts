export const usernamePattern = {
  asRegExp: /^[a-zA-Z0-9_]{5,24}$/,
  asString: '^[a-zA-Z0-9_]{5,24}$',
};
export const passwordPattern = {
  asRegExp: /^[A-Za-z0-9!@#$%^&*\-_]{8,30}$/,
  asString: '^[A-Za-z0-9!@#$%^&*\\-_]{8,30}$',
};
