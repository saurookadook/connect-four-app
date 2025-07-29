import { Link } from 'react-router-dom';

import { useAppStore } from '@/store';
import { navItemsLabels, routerConfig } from '@/app/browserRouter';

export function TopNavBar() {
  const { appState } = useAppStore();
  const { playerID } = appState.player;

  const labelsValues = Object.values(navItemsLabels);

  return (
    <nav className="top-nav-bar">
      <ul>
        {routerConfig[0]?.children?.map((config) => {
          if (
            typeof config.path !== 'string' ||
            // @ts-expect-error: I hope this is just temporarily missing
            !labelsValues.includes(config.label) ||
            (String(config.path).includes('matchmaking') && playerID == null)
          ) {
            return;
          }

          return (
            <li key={`top-nav-${config.path}`}>
              <Link to={config.path}>
                {/* @ts-expect-error: I hope this is just temporarily missing */}
                {config.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
