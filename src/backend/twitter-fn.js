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
        return;
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
    await tweetRef.set(
        {
            data: data,
            likeCt: 0,
            retweets: [],
            time: new Date().toISOString(),
            topic: "undef",
            likes: []
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

