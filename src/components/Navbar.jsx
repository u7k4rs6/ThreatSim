import React from "react";

import Logo from '../assets/movieLogo1.png'

import {Link} from 'react-router-dom'

function NavBar() {
  return (
    <div className="flex space-x-8 items-center pl-3 py-4">
      <Link className="w-[60px]" to='/'>
        <img src={Logo}/>
      </Link>

      <Link to="/"   className="text-blue-500 text-3xl font-bold">
        Movies
      </Link>

      <Link to="/watchlist" className="text-blue-500 text-3xl font-bold">
        Watchlist
      </Link>
      <Link to="/recommend" className="text-blue-500 text-3xl font-bold">
        Movie Recommendations
      </Link>
    </div>
  );
}

export default NavBar;