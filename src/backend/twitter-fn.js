import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebaseConfig from './firebaseConfig';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
  
const db = firebase.firestore();

export async function addUser(firstName, lastName, topics, username, password)
{
    const docRef = db.collection('users').doc(username);
    
    const doc = await docRef.get();
    if(doc.exists )
    {
        console.log("we already are using the username: " + username);
        if(doc.data()["tweets"].length===0)
        {
            console.log("no tweets");
        } else 
        {
            console.log("these are the tweets: " + JSON.stringify(doc.data()["tweets"]));
        }
        return false;
    }
    var insertData = 
    {
        numTweets: 0,
        availableTweetNumbers: [],
        first: firstName,
        last: lastName,
        topics: topics,
        following: [],
        followers: [],
        bookmarks: [],
        password: password,
        tweets: [],
        retweets: []
    }

    await docRef.set(insertData);
    return true;
}

export async function addTweet(username, data)
{
    const docRef = db.collection('users').doc(username);
    
    const doc = await docRef.get();
    if(doc.exists === false)
    {
        console.log("there is no username " + username + " , so we can not tweet");
        return;
    }
    const userData = doc.data();
    
    var numTweetVar = userData["numTweets"];
    var availableTweetNumbers = userData["availableTweetNumbers"];
    if (availableTweetNumbers.length === 0) {
        numTweetVar = userData["numTweets"];
    } else {
        numTweetVar = availableTweetNumbers.pop();
    }
    var currTweets = userData["tweets"];
    currTweets.push('/tweets/' + username + numTweetVar);
    const tweetRef = db.collection('tweets').doc(username + numTweetVar);
    let topicList = await getTopics(data);
    await tweetRef.set(
        {
            data: data,
            likeCt: 0,
            retweets: [],
            time: new Date().toISOString(),
            topics: topicList,
            likes: [],
        
        }
    )
    await docRef.set(
        {
            numTweets: availableTweetNumbers.length === 0 ? parseInt(numTweetVar) + 1 : userData["numTweets"],
            tweets: currTweets,
            availableTweetNumbers: availableTweetNumbers
        },
        {
            merge: true
        }
    )

    var tweetName = username + numTweetVar;
    const batch = db.batch();
    for(let topic of topicList){
        const topicRef = db.collection('topics').doc(topic);
        batch.set(
            topicRef,
            {
                tweets: firebase.firestore.FieldValue.arrayUnion(tweetName)
            },
            {
                merge: true
            }
        );
    }
    await batch.commit();
}

export async function deleteTweet(username, tweetNumber) {
    const userRef = db.collection('users').doc(username);
    const userDoc = await userRef.get();
    if(!userDoc.exists) {
        console.log("User does not exist: " + username);
        return;
    }


    const userData = userDoc.data();
    const tweetRef = db.collection('tweets').doc(username + tweetNumber);
    const tweetDoc = await tweetRef.get();
    if(!tweetDoc.exists) {
        console.log("Tweet does not exist: " + username + tweetNumber);
        return;
    }

    // Begin a batch write to do multiple operations
    const batch = db.batch();

    // Delete the tweet from tweets collection
    batch.delete(tweetRef);

    // Update the user's tweets and availableTweetNumbers
    let tweetPath = '/tweets/' + username + tweetNumber;
    let updatedTweets = userData['tweets'].filter(tweet => tweet !== tweetPath);
    let updatedAvailableTweetNumbers = [...userData['availableTweetNumbers'], tweetNumber];
    let updatedNumTweets = userData['numTweets'] - 1; // Update numTweets by decrementing the current count

    batch.update(userRef, {
        tweets: updatedTweets,
        availableTweetNumbers: updatedAvailableTweetNumbers,
        numTweets: updatedNumTweets
    });

    // Commit the batch write
    await batch.commit();
}

export async function addLike(username, tweet) {
    const userRef = db.collection('users').doc(username);
    const tweetRef = db.collection('tweets').doc(tweet);

    // Check if the user and tweet exist
    const [userDoc, tweetDoc] = await Promise.all([userRef.get(), tweetRef.get()]);
    if(!userDoc.exists) {
        console.log("User does not exist: " + username);
        return;
    }

    if(!tweetDoc.exists) {
        console.log("Tweet does not exist: " + tweet);
        return;
    }

    const tweetData = tweetDoc.data();

    // Check if the user has already liked the tweet
    if (tweetData.likes && tweetData.likes.includes(username)) {
        // If the user has already liked the tweet, unlike it
        const updatedLikes = tweetData.likes.filter(user => user !== username);
        const updatedLikeCt = updatedLikes.length;

        await tweetRef.update({
            likes: updatedLikes,
            likeCt: updatedLikeCt
        });
    } else {
        // If the user has not liked the tweet, like it
        const updatedLikes = tweetData.likes ? [...tweetData.likes, username] : [username];
        const updatedLikeCt = updatedLikes.length;

        await tweetRef.update({
            likes: updatedLikes,
            likeCt: updatedLikeCt
        });
    }
}

export async function addFollow(userA, userB) {
    const userARef = db.collection('users').doc(userA);
    const userBRef = db.collection('users').doc(userB);

    // Check if the users exist
    const [userADoc, userBDoc] = await Promise.all([userARef.get(), userBRef.get()]);
    if(!userADoc.exists) {
        console.log("User does not exist: " + userA);
        return;
    }

    if(!userBDoc.exists) {
        console.log("User does not exist: " + userB);
        return;
    }

    const userAData = userADoc.data();
    const userBData = userBDoc.data();

    // Begin a batch write to execute multiple operations atomically
    const batch = db.batch();

    // Check if userA already follows userB
    if (userAData.following && userAData.following.includes(userB)) {
        // If userA already follows userB, unfollow it
        const updatedFollowingA = userAData.following.filter(user => user !== userB); // make a new array with all users, except for userB
        const updatedFollowersB = userBData.followers.filter(user => user !== userA);

        batch.update(userARef, { following: updatedFollowingA });
        batch.update(userBRef, { followers: updatedFollowersB });
    } else {
        // If userA doesn't follow userB, follow it
        // if we dont currently have a following list, we will just only have userB and userA as the values for the respective lists
        const updatedFollowingA = userAData.following? [...userAData.following, userB] : [userB];
        const updatedFollowersB = userBData.following? [...userBData.followers, userA]: [userA];

        batch.update(userARef, { following: updatedFollowingA });
        batch.update(userBRef, { followers: updatedFollowersB });
    }

    // Commit the batch write
    await batch.commit();
}

export async function retweet(username, tweet) {
    const userRef = db.collection('users').doc(username);
    const tweetRef = db.collection('tweets').doc(tweet);
    // Check if the user and tweet exist
    const [userDoc, tweetDoc] = await Promise.all([userRef.get(), tweetRef.get()]);
    if(!userDoc.exists) {
        console.log("User does not exist: " + username);
        return;
    }

    if(!tweetDoc.exists) {
        console.log("Tweet does not exist: " + tweet);
        return;
    }

    const tweetData = tweetDoc.data();
    const userData = userDoc.data();

    // Ensure the tweet is not the user's own tweet
    if (username === tweetData.username) {
        console.log("User cannot retweet their own tweet");
        return;
    }

    // Check if the user has already retweeted the tweet
    if (userData.retweets && userData.retweets.includes(tweet)) {
        console.log("User has already retweeted this tweet");
        return;
    } else {
        // If the user has not retweeted the tweet, retweet it
        const updatedRetweets = userData.retweets ? [...userData.retweets, tweet] : [tweet];

        await userRef.update({
            retweets: updatedRetweets
        });
    }
}


export async function getTopics(tweet, topics=["Music", "Fashion", "Tech", "Sports", "Finance", "Education", "Random"]) {
    /*

       query("I cant believe drake dropped a new album!", ["music", "sports", "fashion"]).then((response) => {
    console.log(JSON.stringify(response));
   });

    */
    let data = {
        "inputs": tweet, "parameters": 
        {
          "candidate_labels": topics
        }
    }
    let API_TOKEN = "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";
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
        {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );
    const result = await response.json()
    // console.log("result data " + JSON.stringify(result));
    // console.log("result scores are  " + JSON.stringify(result["scores"]));
    let hTopics = []
    for(let i=0;i<7;i++)
    {
        if(parseFloat((JSON.stringify(result["scores"][i])) * 100) > 50)
        {
            hTopics.push(result["labels"][i]);
        }
    }
    
    // console.log("topics are : " + hTopics.toString() );
    return hTopics;
}

export async function getHomepage(username){
    // Get user data
    const userRef = db.collection('users').doc(username);
    const userDoc = await userRef.get();
    if(!userDoc.exists) {
        console.log("User does not exist: " + username);
        return;
    }
    const userData = userDoc.data();
    
    let homepageTweets = [];
    let seenTweetNames = new Set(); // Keep track of tweet names we've already added

    const addTweetNameIfUnique = (tweetNameWithPath) => {
        // Remove the '/tweets/' prefix from the tweet name
        let tweetName = tweetNameWithPath.replace('/tweets/', '');

        // If we've already seen this tweet, skip it
        if (seenTweetNames.has(tweetName)) return;
        // Otherwise, add it to the list
        homepageTweets.push(tweetName);
        seenTweetNames.add(tweetName); // Mark this tweet as seen
    };

    // Fetch tweets related to the topics the user follows
    for(let topic of userData.topics){
        const topicRef = db.collection('topics').doc(topic);
        const topicDoc = await topicRef.get();
        if(topicDoc.exists) {
            const topicData = topicDoc.data();
            for(let tweetName of topicData.tweets){
                addTweetNameIfUnique(tweetName);
            }
        }
    }

    // Fetch tweets and retweets from the users the user follows
    for(let followedUser of userData.following){
        const followedUserRef = db.collection('users').doc(followedUser);
        const followedUserDoc = await followedUserRef.get();
        if(followedUserDoc.exists) {
            const followedUserData = followedUserDoc.data();
            for(let tweetName of followedUserData.tweets){
                addTweetNameIfUnique(tweetName);
            }
            for(let retweetName of followedUserData.retweets){
                addTweetNameIfUnique(retweetName);
            }
        }
    }

    console.log("homepage tweets are: " + JSON.stringify(homepageTweets));
    return homepageTweets;
}

export async function getExplore() {
    // Get reference to tweets collection
    const tweetsRef = db.collection('tweets');

    // Get all tweets
    const snapshot = await tweetsRef.get();

    // currently inefficient as it fetches all the tweets into memory then chooses 15 random ones
    // Put all tweet names in an array
    const allTweets = [];
    snapshot.forEach(doc => {
        allTweets.push(doc.id);
    });

    // If there are less than or equal to 15 tweets, return all of them
    if (allTweets.length <= 15) {
        return allTweets;
    }

    // If there are more than 15 tweets, pick 15 at random
    const exploreTweets = [];
    for (let i = 0; i < 15; i++) {
        const randomIndex = Math.floor(Math.random() * allTweets.length);
        exploreTweets.push(allTweets[randomIndex]);
        // Remove selected tweet from the allTweets array to avoid picking it again
        allTweets.splice(randomIndex, 1);
    }
    console.log("Explore page is " + JSON.stringify(exploreTweets));
    return exploreTweets;
}

export async function getTweetData(tweets) {
    const tweetData = [];

    // Go through each tweet
    for (let i = 0; i < tweets.length; i++) {
        const tweetRef = db.collection('tweets').doc(tweets[i]);
        const doc = await tweetRef.get();
        
        if (doc.exists) {
            const data = doc.data();

            // Extract the name of the user who posted the tweet
            let username = tweets[i].replace(/[0-9]/g, '');
            username = username || "N/A";

            // Extract and format the time the tweet was posted
            let timestamp = new Date(data.time);
            let timePosted = `${timestamp.getMonth() + 1}/${timestamp.getDate()}/${timestamp.getFullYear()} ${timestamp.getHours()}:${timestamp.getMinutes()}pm`;
            timePosted = timePosted || "N/A";

            // Extract the number of likes on the tweet
            let likes = data.likeCt !== undefined ? data.likeCt : "N/A";

            // Extract the topic of the tweet, remove any extra quotes or slashes
            let topics = Array.isArray(data.topics) ? data.topics.map(topic => topic.replace(/['"\\]+/g, '')).join(', ') : "N/A";

            // Extract the text of the tweet
            let text = data.data;
            text = text || "N/A";

            // Add the tweet's data to the array
            tweetData.push({username, timePosted, likes, topics, text});
        } else {
            console.log('No such document!');
        }
    }

    return tweetData;
}
