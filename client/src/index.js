import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Login } from './Pages/Login';
import { LandingPage } from './Pages/LandingPage';
import { Dashboards } from './Pages/Dashboard';
import { Register } from './Pages/Register';

const rootElement = document.getElementById('root');

const LandingStack = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />}></Route>
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Register />} />
    </Routes>
  );
};

const DashboardStack = () => {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboards />}>
        {/* <Route path=":userInfo" element={<Dashboards />} /> */}
      </Route>
    </Routes>
  );
};

render(
  <>
    <BrowserRouter>
      <LandingStack />
      <DashboardStack />
    </BrowserRouter>
  </>,
  rootElement
);
