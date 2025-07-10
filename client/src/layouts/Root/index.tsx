import { Outlet } from 'react-router-dom';

import { TopNavBar } from '@/components';
import { FlexColumn } from '@/layouts';
import './styles.css';

export function Root() {
  return (
    <div id="root-layout">
      <TopNavBar />

      <FlexColumn className="card">
        <Outlet />
      </FlexColumn>
    </div>
  );
}
