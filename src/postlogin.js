
//switching between pages on postlogin (test code not complete)

import React from 'react';
import { Link, useRoutes } from 'react-router-dom';
import './prelogin.css';
import './postlogin.css';
import twitterLogo from './twitterlogo.png';
import glass from './glass.png';
import home from './twitterhome.png';
import bookmark from './bookmark.png';
import profile from './profile.png';
import { useState } from 'react';

import Home from './home';
import Explore from './Explore';
import Bookmarks from './bookmarks';
import SignUp from './SignUp';

const routes = [
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/explore',
    element: <Explore />,
  },
  {
    path: '/bookmarks',
    element: <Bookmarks />,
  }
];

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
  
    const handleInputChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      //rest of code

    };
  
    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button type="submit">Search</button>
      </form>
    );
  };

const PostLogin = () => {
  const element = useRoutes(routes);

  return (
    <div className="App">
      <div className="sidebar one">
        <img className="bird" alt="Twitter Logo" src={twitterLogo} />
        <br />
        <Link to="/home">
          <img className="home" src={home} />
          <h2 className="home-sidebar">Home</h2>
        </Link>
        <br />
        <Link to="/explore">
          <img className="glass" src={glass} />
          <h2 className="explore-side">Explore</h2>
        </Link>
        <br />
        <Link to="/bookmarks">
          <img className="bookmark" src={bookmark} />
          <h2 className="book-sidebar">Bookmarks</h2>
        </Link>
        <br />
        <Link to="/profile">
          <img className="profile" src={profile} />
          <h2 className="profile-sidebar">Profile</h2>
        </Link>
        <br /> <br />
        <button className="tweet">Tweet</button>
        <br />
        <br />
        <Link to="/">Go to Prelogin</Link>
      </div>
      <div className="sidebar two">
       <h2>Home</h2>
       </div>
      <div className="sidebar three">
          <div className='search-bar-container'>
          <SearchBar />
          </div>
        </div>
    </div>
  );
};

export default PostLogin;
