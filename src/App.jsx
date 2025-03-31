// import Header from "./components/Header";
// import HeroSection from "./components/HeroSection";
// import Services from "./components/Services";
// import Footer from "./components/Footer";
// import "./App.css";
// function App() {
//   return (
//     <>
//       <Header />
//       <HeroSection />
//       <Services />
//       <Footer />
//     </>
//   );
// }
// export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { supabase } from './supabaseClient';

import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Services from './components/Services';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';

import './App.css';

function App() {
  const [user, setUser] = useState(null);

  // Check if the user is authenticated on mount
  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <Router>
      <Header user={user} />
      <Switch>
        <Route path="/" exact>
          <HomePage user={user} />
        </Route>
        <Route path="/login" exact>
          <LoginPage setUser={setUser} />
        </Route>
        <Route path="/dashboard" exact>
          {user ? <DashboardPage /> : <LoginPage setUser={setUser} />}
        </Route>
        <Route path="/services" exact>
          <Services />
        </Route>
        {/* Add more routes as necessary */}
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
