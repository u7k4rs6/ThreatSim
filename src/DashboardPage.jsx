// src/pages/DashboardPage.jsx
import React, { useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useHistory } from 'react-router-dom';

const DashboardPage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = supabase.auth.user();
    if (!user) {
      history.push('/login');
    }
  }, [history]);

  return <div>Welcome to your dashboard!</div>;
};

export default DashboardPage;
