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
            topic: "undef"
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
