import './App.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import {
  Routes,
  Route,
  Navigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { LandingPage } from '../src/screens/LandingPage';
import { Login } from '../src/screens/Login';
import { Register } from '../src/screens/Register';
import { NotFound } from '../src/screens/NotFound';
import { Header } from '../src/components/Header';
import { Dashboard } from '../src/screens/Dashboard';
import { getStorageItem } from './storage/LocalStorage';
import { storageKey } from './constants/keys';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { Profile } from './screens/Profile';
import AuthenticationRoute from './screens/AuthenticationRoute';

function App() {
  // const params = useSearchParams();
  // const isAuthenticated = getStorageItem(storageKey.ACCESS_TOKEN);
  // const isAuthenticated = localStorage.getItem('ACCESS_TOKEN');
  // console.log('app>>>>>>>>', isAuthenticated);

  // useEffect(() => {}, [isAuthenticated]);

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <AuthenticationRoute>
              <Dashboard />
            </AuthenticationRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <AuthenticationRoute>
              <Profile />
            </AuthenticationRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
