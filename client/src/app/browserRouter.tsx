import {
  createBrowserRouter, // force formatting
  redirect,
  type RouteObject,
} from 'react-router-dom';

import { safeParseJSON, sharedLog } from '@connect-four-app/shared';
import { PLAYER_DETAILS_LS_KEY } from '@/constants';
import { Root } from '@/layouts';
import {
  AccountPortal,
  GameSession, // force formatting
  GameSessionsHistory,
  Home,
  Matchmaking,
  Login,
  Register,
} from '@/pages';

const logger = sharedLog.getLogger('browserRouter');

export const navItemsLabels = {
  HOME: 'Home',
  MATCHMAKING: 'Matchmaking',
  GAME_SESSIONS_HISTORY: 'Game Sessions History',
  ACCOUNT: 'Account',
};

/**
 * @note possibilities for implementing protected/public routes
 * - https://github.com/remix-run/react-router/issues/10637#issuecomment-1802180978
 * - https://medium.com/@umaishassan/private-protected-and-public-routes-in-react-router-v6-e8fb623aa81
 */
export const routerConfig: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    HydrateFallback: () => null,
    loader: async ({ request }) => {
      if (window != null && window.location?.pathname === '/') {
        const homeUrl = new URL(request.url);
        homeUrl.pathname = '/home';

        return window.location.assign(homeUrl.toString());
      }
      return;
    },
    children: [
      {
        path: 'home',
        // @ts-expect-error: I hope this is just temporarily missing
        label: navItemsLabels.HOME,
        element: <Home />,
      },
      {
        path: 'matchmaking',
        // @ts-expect-error: I hope this is just temporarily missing
        label: navItemsLabels.MATCHMAKING,
        element: <Matchmaking />,
      },
      {
        path: 'game-sessions-history',
        // @ts-expect-error: I hope this is just temporarily missing
        label: navItemsLabels.GAME_SESSIONS_HISTORY,
        element: <GameSessionsHistory />,
      },
      {
        path: 'game-session/:gameSessionID?',
        // @ts-expect-error: I hope this is just temporarily missing
        label: 'GameSession',
        element: <GameSession />,
        loader: async ({ params }) => {
          if (
            params['gameSessionID'] == null ||
            params['gameSessionID'] == ':gameSessionID'
          ) {
            return redirect('/game-sessions-history');
          }
        },
      },
      {
        // TODO: add dynamic path component? Better name than `subPage`?
        path: 'account/:subPage',
        // @ts-expect-error: I hope this is just temporarily missing
        label: navItemsLabels.ACCOUNT,
        element: <AccountPortal />,
        // TODO: this whole loader situation feels... messy?
        loader: async ({ params }) => {
          const playerDetailsFromLocalStorage =
            window.localStorage.getItem(PLAYER_DETAILS_LS_KEY);
          const parsedPlayerData = safeParseJSON(playerDetailsFromLocalStorage);

          if (parsedPlayerData?.playerID != null && params['subPage'] !== 'details') {
            return redirect('/account/details');
          }

          if (params['subPage'] == null || params['subPage'] === ':subPage') {
            const targetPathname =
              parsedPlayerData?.playerID != null
                ? '/account/details'
                : '/account/login';

            return redirect(targetPathname);
          }
        },
      },
    ],
  },
];

const browserRouter = createBrowserRouter(routerConfig);

export default browserRouter;
