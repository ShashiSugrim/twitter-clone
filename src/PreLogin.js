import React from 'react';
import './App.css'
import './prelogin.css';
import twitterLogo from './twitterlogo.png';
import glass from './glass.png';
import SignIn from './SignIn.js';
import { Link } from 'react-router-dom';

function PreLogin() {
  return (
<div className="App">
<div className="sidebar one">
<img className="bird" alt="Twitter Logo" src={twitterLogo} />
 <br />
    <img className = "glass" src = {glass} />
    <h2 className = "explore-side">Explore</h2>
</div>
<div className="sidebar two">
    <h2 className = "explore-side2">Explore</h2>
</div>
<div className="sidebar three">
<div className="new-to-twitter-box">
      <h2 className = "new-to-text">New to Twitter?</h2>
      <p className = "sign-up-text"> Sign up now to get your own personalized timeline!</p>
      <button className="signup-button">Sign up</button>
      <Link to="/postlogin">Go to PostLogin</Link>
    </div>
</div>
<SignIn />
</div> 
  );
}

export default PreLogin;
