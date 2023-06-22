import React, { useState } from 'react';
import twitterLogo from './twitterlogo.png';
import './SignIn.css';

function SignIn() {
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // rest of submission code
  };

  const handleSignInWithGoogle = () => {
    window.location.href = 'https://accounts.google.com/signin';
    //google signin code
  };

  const handleSignInWithApple = () => {
    window.location.href = 'https://appleid.apple.com/auth/authorize';
    //apple signin code
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const Popup = () => {
    return (
      <div className="popup">
        <span className="close" onClick={closePopup}>×</span>
        <h2 className = "intro">Sign in to Twitter</h2>
        <div>
          <button className="signin-google" onClick={handleSignInWithGoogle}>Sign in with Google</button>
          <br /> <br /> 
          <button className="signin-apple" onClick={handleSignInWithApple}>Sign in with Apple</button>
        </div>
        <h4>───────── or ─────────</h4>
        <form onSubmit={handleSubmit}>
          <label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Phone, email, or username"
            />
          </label>
          <br />
          <button className = "next-button" type="submit">Next</button>
          <br /> <br/>
          <button className = "forgot-button" type="submit">Forgot Password?</button>
        </form>
        <h5>Don't have an account? <a href="">Sign up</a></h5>
      </div>
    );
  };

  return (
    <div className="container">
      <img className="bird" alt="Twitter Logo" src={twitterLogo} />
      <button className="open-popup" onClick={openPopup}>Log in</button>

      {showPopup && (
        <div className="popup-container">
          <Popup />
        </div>
      )}
    </div>
  );
}

export default SignIn;


