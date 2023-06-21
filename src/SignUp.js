import React, { useState } from 'react';
import twitterLogo from './twitterlogo.png';
import './SignUp.css'; // Assuming you have a separate CSS file for SignUp
import SignIn from './SignIn.js';

function SignUp() {
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Rest of submission code
  };

  const handleSignUpWithGoogle = () => {
    window.location.href = 'https://accounts.google.com/signup';
    // Google sign-up code
  };

  const handleSignUpWithApple = () => {
    window.location.href = 'https://appleid.apple.com/auth/authorize';
    // Apple sign-up code
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
        <img className="bird" alt="Twitter Logo" src={twitterLogo} />
        <h2 className="intro">Join Twitter today</h2>
        <div>
          <button className="signin-google" onClick={handleSignUpWithGoogle}>Sign up with Google</button>
          <br /><br />
          <button className="signin-apple" onClick={handleSignUpWithApple}>Sign up with Apple</button>
        </div>
        <h4>───────── or ─────────</h4>
        <form onSubmit={handleSubmit}>
          <button className="next-button" type="submit">Create Account</button>
        </form>
        <h5>Have an account already? <a href={SignIn}>Log in</a></h5>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="container">
        <footer className="footer">
          <div className="footer-content">
            <h4>Don't miss what's happening</h4>
            <h5>People on Twitter are the first to know.</h5>
            <button className="open-popup" onClick={openPopup}>Sign up</button>
            {showPopup && (
              <div className="popup-container">
                <Popup />
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default SignUp;
