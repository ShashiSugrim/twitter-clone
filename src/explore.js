import React, {useEffect, useState} from 'react'
import Tweet from './Tweet'
import axios from "axios";

const Explore = () => {
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
    <>
        <h2>Explore</h2>
        <hr/>
        {tweets? tweets.map((item, index)=>{ return (<><Tweet username={item.username} title={item.title} description={item.description} time_stamp={item.date_created}/><hr/></>)}): null}

    </>
  )
}

export default Explore