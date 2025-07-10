import { useState } from 'react';
import { ViteReactHeader } from '@/components';

export function Home() {
  const [count, setCount] = useState(0);

  function handleCounterClick(event: React.MouseEvent<HTMLButtonElement>) {
    console.log(
      '    handleCounterClick    '.padStart(60, '?').padEnd(120, '?'),
      '\n',
      { event },
      '\n',
      '?'.repeat(120),
    );

    const newCount = count + 1;
    // ws.send(JSON.stringify({ count: newCount }));
    setCount(newCount);
  }

  return (
    <div id="home">
      <ViteReactHeader />

      <h2>{`🏡 Home 🏡`}</h2>

      <button // force formatting
        onClick={handleCounterClick}
      >
        count is {count}
      </button>
    </div>
  );
}
