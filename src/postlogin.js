
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
import { useState, useRef, useEffect } from 'react';

import Home from './home';
import Explore from './Explore';
import Bookmarks from './bookmarks';
import SignUp from './SignUp';
import axios from "axios";
import Tweet from './Tweet';

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
  const favDialog = useRef(0);
  const tweetDesc = useRef("");
  const tweetTitle = useRef("");

  const handleTweet = (event) =>
  {
    favDialog.current.showModal();
  }

  const sendTweet = async (event) =>
  {
    let body =     {
      "title": tweetTitle.current.value,
      "description": tweetDesc.current.value,
      "username": "user2"
  }
    await axios.post("http://localhost:3001/tweets", body ).then((res)=>{console.log("success!" + res.status)})
    alert("successully posted tweet!");
    favDialog.current.close();
    // console.log(tweetDesc.current.value);
  }
  const[tweets, setTweets] = useState([]);

  async function getTweets() {
    const results = await axios.get("http://localhost:3001/tweets");
    console.log("Results are " + JSON.stringify(results));
    setTweets(results.data);
  }
  useEffect(()=>{
    let ignore = false;

    if (!ignore) getTweets();

    return () => {
      ignore = true;
    };
  }
    , []
  )
  return (
    <div className="App">
      <dialog ref={favDialog}>
  <form>
    <p>
      <label for="title">Title</label>
      <input id="title" ref={tweetTitle}></input>
      <label for="description">Description</label>
      <textarea id="description" ref={tweetDesc}></textarea>
    </p>
    <div>
      <button value="cancel" formmethod="dialog">Cancel</button>
      <button onClick={sendTweet} id="confirmBtn" type="button">Submit Tweet</button>
    </div>
  </form>
</dialog>
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
        <button onClick={handleTweet}className="tweet">Tweet</button>
        <br />
        <br />
        <Link to="/">Go to Prelogin</Link>
      </div>
      <div className="sidebar two">
       <h2>Home</h2>
       {tweets? tweets.map((item, index)=>{ return (<><Tweet username={item.username} title={item.title} description={item.description} time_stamp={item.date_created}/><hr/></>)}): null}

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
