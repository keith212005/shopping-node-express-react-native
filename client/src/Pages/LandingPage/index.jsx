import { Outlet } from 'react-router';
import { NavBar } from '../../Components/NavBars/NavBar';

export const LandingPage = () => {
  return (
    <>
      <NavBar />
      <p>I am Landing page</p>
      <Outlet />
    </>
  );
};
