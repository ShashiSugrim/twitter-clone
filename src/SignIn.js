import React, { useState } from 'react';
import twitterLogo from './twitterlogo.png';
import './SignIn.css';

const Popup = ({ closePopup }) => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // rest of submission code
  };

  const handleSignInWithGoogle = () => {
    window.location.href = 'https://accounts.google.com/signin';
    // google signin code
  };

  const handleSignInWithApple = () => {
    window.location.href = 'https://appleid.apple.com/auth/authorize';
    // apple signin code
  };

  return (
    <div className="popup">
      <span className="close" onClick={closePopup}> x</span>
      <img className="bird" alt="Twitter Logo" src={twitterLogo} />
      <h2 className="intro">Sign in to Twitter</h2>
      <div>
        <button className="signin-google" onClick={handleSignInWithGoogle}>Sign in with Google</button>
        <br /><br />
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
        <button className="next-button" type="submit">Next</button>
        <br /><br />
        <button className="forgot-button" type="submit">Forgot Password?</button>
      </form>
      <h5>Don't have an account? <a href=" ">Sign up</a></h5>
    </div>
  );
};

function SignIn() {
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="App">
      <footer className="footer">
        <div className="footer-content">
          <h4>Don't miss what's happening</h4>
          <h5> People on Twitter are the first to know. </h5>
          <button className="open-popup" onClick={openPopup}>Log in</button>
          {showPopup && (
            <div className="popup-container">
              <Popup closePopup={closePopup} />
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

export default SignIn;
