// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = ({ user }) => {
  return (
    <div>
      <h1>Home Page</h1>
      {user ? (
        <p>Welcome, {user.email}!</p>
      ) : (
        <p>
          Please <Link to="/login">Login</Link> to access the dashboard.
        </p>
      )}
    </div>
  );
};

export default HomePage;
