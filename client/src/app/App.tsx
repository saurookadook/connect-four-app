import { RouterProvider } from 'react-router-dom';

import { useLoadPlayer } from '@/store';
import browserRouter from './browserRouter';
import './App.css';

function App() {
  useLoadPlayer();

  return (
    <main>
      <RouterProvider router={browserRouter} />
    </main>
  );
}

export default App;
