import { Link } from 'react-router-dom';

import { routerConfig } from '@/app/browserRouter';

export function TopNavBar() {
  return (
    <nav className="top-nav-bar">
      <ul>
        {routerConfig[0]?.children?.map((config) => {
          return (
            typeof config.path === 'string' && (
              <li key={`top-nav-${config.path}`}>
                <Link to={config.path}>
                  {/* @ts-expect-error: I hope this is just temporarily missing */}
                  {config.label}
                </Link>
              </li>
            )
          );
        })}
      </ul>
    </nav>
  );
}
