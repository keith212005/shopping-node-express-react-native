import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from '../../components/Loader';

export const LandingPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = localStorage.getItem('ACCESS_TOKEN');
    if (auth) navigate('/dashboard');
  }, []);

  return (
    <>
      <h2 style={{ marginTop: '20rem' }}>This is Landing Page</h2>
    </>
  );
};
