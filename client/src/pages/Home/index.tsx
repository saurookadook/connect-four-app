import { useState } from 'react';
import { ViteReactHeader } from '@/components';

export function Home() {
  const [count, setCount] = useState(0);

  function handleCounterClick(
    event: React.MouseEvent<HTMLButtonElement>, // force formatting
  ) {
    const newCount = count + 1;
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
