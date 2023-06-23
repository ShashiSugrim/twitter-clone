/*import React from 'react';
import './App.css';
import twitterLogo from './twitterlogo.png';
import glass from './glass.png'
import SignIn from './SignIn.js';
import PostLogin from './postlogin';
import { BrowserRouter as Router, Route ,Routes} from 'react-router-dom';

function App() {
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
    </div>
    <Router>
      <Routes>
      <Route exact path="/app">
      </Route>
      <Route exact path="/postlogin" component={PostLogin} />
      </Routes>
    </Router>
</div>
<SignIn />
</div> 
);
}

//<SignIn />
export default App;*/

/**import React from 'react';
import './App.css';
import twitterLogo from './twitterlogo.png';
import glass from './glass.png';
import SignIn from './SignIn.js';
import PostLogin from './postlogin';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/app" element={<h1>Home</h1>} />
          <Route path="/postlogin" element={<PostLogin />} />
        </Routes>
      <div className="App">
        <div className="sidebar one">
          <img className="bird" alt="Twitter Logo" src={twitterLogo} />
          <br />
          <img className="glass" src={glass} />
          <h2 className="explore-side">Explore</h2>
        </div>
        <div className="sidebar two">
          <h2 className="explore-side2">Explore</h2>
        </div>
        <div className="sidebar three">
          <div className="new-to-twitter-box">
            <h2 className="new-to-text">New to Twitter?</h2>
            <p className="sign-up-text">
              Sign up now to get your own personalized timeline!
            </p>
            <button className="signup-button">Sign up</button>
            <Link to="/postlogin">Go to PostLogin</Link>
          </div>
        </div>
        <SignIn />
      </div>
    </Router>
  );
}

export default App; */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PreLogin from './PreLogin';
import PostLogin from './postlogin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PreLogin />} />
        <Route path="/postlogin" element={<PostLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
