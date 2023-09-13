import React from 'react';
import './App.css'
import './prelogin.css';
import twitterLogo from './twitterlogo.png';
import glass from './glass.png';
import SignIn from './SignIn.js';
import { Link, useNavigate } from 'react-router-dom';
import Explore from './Explore';
import SignUp from './SignUp';

function PreLogin() {
  let navigate = useNavigate();
  const handleSignUp = (event) =>
  {
    navigate("/signup")
  }
  return (
<div className="App">
<div className="sidebar one">
<img className="bird" alt="Twitter Logo" src={twitterLogo} />
 <br />
    <img className = "glass" src = {glass} />
    <h2 className = "explore-side">Explore</h2>
</div>
<div className="sidebar two">
    {/* <h2 className = "explore-side2">Explore</h2> */}
    <Explore className = "explore-side2"/>
</div>
<div className="sidebar three">
<div className="new-to-twitter-box">
      <h2 className = "new-to-text">New to Twitter?</h2>
      <p className = "sign-up-text"> Sign up now to get your own personalized timeline!</p>
      <button onClick={handleSignUp} className="signup-button">Sign up</button>
      <Link to="/postlogin">Go to PostLogin</Link>
    </div>
</div>
<SignIn />
</div> 
  );
}

export default PreLogin;
