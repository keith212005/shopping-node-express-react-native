import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      const auth = localStorage.getItem('ACCESS_TOKEN');
      if (auth) navigate('/dashboard');
      else navigate('/login');
    }, 1000);
  }, []);

  return <h1 style={{ marginTop: '20rem' }}>NotFound</h1>;
};
