import {
  createBrowserRouter, // force formatting
  type RouteObject,
} from 'react-router-dom';

import { Root } from '@/layouts';
import {
  ConnectFour, // force formatting
  GameSessionsHistory,
  Home,
  Login,
  Register,
} from '@/pages';

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
        label: 'Home',
        element: <Home />,
      },
      {
        // TODO: make this page conditionally render Login/Register
        // or maybe consolidate into auth portal?
        path: 'login',
        // @ts-expect-error: I hope this is just temporarily missing
        label: 'Login',
        element: <Login />,
      },
      {
        // TODO: make this page conditionally render Login/Register
        path: 'register',
        // @ts-expect-error: I hope this is just temporarily missing
        label: 'Register',
        element: <Register />,
      },
      {
        path: 'game-sessions-history',
        // @ts-expect-error: I hope this is just temporarily missing
        label: 'Game Sessions History',
        element: <GameSessionsHistory />,
      },
      {
        path: 'connect-four',
        // @ts-expect-error: I hope this is just temporarily missing
        label: 'ConnectFour',
        element: <ConnectFour />,
      },
    ],
  },
];

const browserRouter = createBrowserRouter(routerConfig);

export default browserRouter;
