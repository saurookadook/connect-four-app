import { ReactLogo, ViteLogo } from '@/components';

export function ViteReactHeader() {
  return (
    <div>
      <h1>Vite + React</h1>

      <ViteLogo />
      <ReactLogo />

      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </div>
  );
}
