import { Nullable, safeParseJSON, sharedLog } from '@connect-four-app/shared';
import { BASE_API_SERVER_URL } from '@/constants';
import { type BoundThis } from '@/types/main';

const logger = sharedLog.getLogger(safeFetch.name);

export type OnErrorCallback = ({
  error,
  response,
}: {
  error: Error;
  response: Nullable<any>;
}) => any;

export async function resolveResponseData(response: Response) {
  if (response.status === 202) {
    const dataAsText = await response.text();
    return safeParseJSON(dataAsText) || dataAsText;
  }

  return await response.json();
}

export async function safeFetch(
  this: BoundThis,
  {
    requestPathname,
    fetchOpts,
    onErrorCallback,
  }: {
    requestPathname: string;
    fetchOpts: RequestInit;
    onErrorCallback?: OnErrorCallback | Promise<OnErrorCallback>;
  },
) {
  const funcName = this.name
    ? this.name.replace(/\$/, '')
    : `safeFetch: ${fetchOpts.method} '${requestPathname}'`;

  let responseData = null;
  let response;

  try {
    const requestURL = new URL(requestPathname, BASE_API_SERVER_URL);
    response = await fetch(requestURL, fetchOpts);

    if (!response.ok || response.status >= 400) {
      // other pattern: /(?:\S\+)?([A-Z])/g
      const explanationFromFuncName = funcName.replace(
        /[A-Z]+/g,
        function (match, offset) {
          return (offset > 0 ? ' ' : '') + match.toLowerCase();
        },
      );
      throw new Error(
        `[ERROR ${response.status}] Failed to ${explanationFromFuncName}`,
      );
    }

    responseData = await resolveResponseData(response);
  } catch (error) {
    const _error: Error = error instanceof Error ? error : new Error();

    if (onErrorCallback != null && typeof onErrorCallback === 'function') {
      return onErrorCallback({
        error: _error,
        response: response,
      });
    }

    logger.error(_error);
    throw new Error(`[${funcName}] ${_error.message}`, { cause: error });
  }

  return responseData;
}
