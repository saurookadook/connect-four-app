import { BASE_API_SERVER_URL } from '@/constants';

type BoundThis = {
  name: string;
};

export async function safeFetch(
  this: BoundThis,
  {
    requestPathname,
    fetchOpts,
  }: {
    requestPathname: string;
    fetchOpts: RequestInit;
  },
) {
  const funcName = this.name
    ? this.name.replace(/\$/, '')
    : `safeFetch: ${fetchOpts.method} '${requestPathname}'`;

  let responseData = null;

  try {
    const requestURL = new URL(requestPathname, BASE_API_SERVER_URL);
    const response = await fetch(requestURL, fetchOpts);

    if (!response.ok || response.status >= 400) {
      // other pattern: /(?:\S\+)?([A-Z])/g
      const explanationFromFuncName = funcName.replace(/[A-Z]+/g, function (match, offset) {
        return (offset > 0 ? ' ' : '') + match.toLowerCase();
      });
      throw new Error(`[ERROR ${response.status}] Failed to ${explanationFromFuncName}`);
    }

    responseData = await response.json();
  } catch (error) {
    const _error: Error = error instanceof Error ? error : new Error();
    console.error(_error);
    throw new Error(`[${funcName}] ${_error.message}`, { cause: error });
  }

  return responseData;
}
