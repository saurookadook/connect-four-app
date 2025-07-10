import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { routerConfig } from '@/app/browserRouter';

export function WithMemoryRouter({
  initialEntries = ['/'],
  initialIndex = 0,
}: {
  initialEntries?: string[];
  initialIndex?: number;
}) {
  const router = createMemoryRouter(routerConfig, {
    initialEntries,
    initialIndex,
  });

  return <RouterProvider router={router} />;
}
