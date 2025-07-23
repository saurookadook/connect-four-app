import {
  createBrowserRouter, // force formatting
  redirect,
  type RouteObject,
} from 'react-router-dom';

import { sharedLog } from '@connect-four-app/shared';
import { Root } from '@/layouts';
import {
  AccountPortal,
  GameSession, // force formatting
  GameSessionsHistory,
  Home,
  Login,
  Register,
} from '@/pages';

const logger = sharedLog.getLogger('browserRouter');

export const navItemsLabels = {
  HOME: 'Home',
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
      // {
      //   // TODO: make this page conditionally render Login/Register
      //   // or maybe consolidate into auth portal?
      //   path: 'login',
      //   // @ts-expect-error: I hope this is just temporarily missing
      //   label: 'Login',
      //   element: <Login />,
      // },
      // {
      //   // TODO: make this page conditionally render Login/Register
      //   path: 'register',
      //   // @ts-expect-error: I hope this is just temporarily missing
      //   label: 'Register',
      //   element: <Register />,
      // },
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
        loader: async ({ params }) => {
          if (params['subPage'] == null || params['subPage'] == ':subPage') {
            return redirect('/account/details');
          }
        },
      },
    ],
  },
];

const browserRouter = createBrowserRouter(routerConfig);

export default browserRouter;
