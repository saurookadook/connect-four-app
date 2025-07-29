import { safeParseJSON, sharedLog } from '@connect-four-app/shared';
import { BASE_API_SERVER_URL } from '@/constants';
import { type BoundThis } from '@/types/main';

const logger = sharedLog.getLogger(safeFetch.name);

async function resolveResponseData(response: Response) {
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
    onErrorCallback?: () => void;
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
    logger.error(_error);
    throw new Error(`[${funcName}] ${_error.message}`, { cause: error });
  }

  return responseData;
}
