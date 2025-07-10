import { RouterProvider } from 'react-router-dom';

import browserRouter from '@/app//browserRouter';
import '@/app/App.css';

function App() {
  return (
    <main>
      <RouterProvider router={browserRouter} />
    </main>
  );
}

export default App;
