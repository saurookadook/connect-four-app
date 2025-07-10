import viteLogo from '/vite.svg';
import { AnchorLink } from '@/components';

function ViteLogo() {
  return (
    <AnchorLink href="https://vite.dev" target="_blank">
      <img src={viteLogo} className="logo" alt="Vite logo" />
    </AnchorLink>
  );
}

export default ViteLogo;
