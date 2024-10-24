import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './components/HomePage/HomePage';
import GetAnimal from './components/Animal/GetAnimal';
import * as sessionActions from './store/session';
import GetReservationsPage from './components/Reservations/GetReservationsPage';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />
      },
      {
        path: ':id',
        element: <GetAnimal />
      },
      {
        path: '/reservations',
        element: <GetReservationsPage />
      }

    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;