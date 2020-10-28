import React, { useState, useRef, useEffect } from "react";
import useSound from "use-sound";
import boopSound from "./menu-open.mp3";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

const Settings = {
  MAX_MESSAGES: 100,
  SOFT_KEYBOARD_OPEN_DELAY: 50,
};

firebase.initializeApp({
  apiKey: "AIzaSyACHocPkDUzh59OfnqXtfx0SkvaKHEfrmA",
  authDomain: "superchat-11bdc.firebaseapp.com",
  databaseURL: "https://superchat-11bdc.firebaseio.com",
  projectId: "superchat-11bdc",
  storageBucket: "superchat-11bdc.appspot.com",
  messagingSenderId: "206674897831",
  appId: "1:206674897831:web:a33e919945e6ed554b6482",
  measurementId: "G-201RN4JJRW",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  // Google Firebase Authentication
  const [user] = useAuthState(auth);

  // Disable pinch zooming
  useEffect(() => {
    const disablePinchZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", disablePinchZoom, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", disablePinchZoom);
    };
  }, []);

  return (
    <div className="App">
      {user ? <Header /> : null}

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

// SIGN IN SCREEN COMPONENT
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <button className="sign-in" onClick={signInWithGoogle}>
      Sign into MegaChat with Google
    </button>
  );
}

// CHAT WINDOW HEADER COMPONENT
function Header() {
  return (
    auth.currentUser && (
      <header>
        <img src={auth.currentUser.photoURL} alt="" />

        <h2>{auth.currentUser.displayName}</h2>

        <SignOut />
      </header>
    )
  );
}

// SIGN OUT BUTTON COMPONENT
function SignOut() {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign out</button>
  );
}

// MAIN CHAT ROOM COMPONENT
function ChatRoom() {
  const messageBottom = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef
    .orderBy("createdAt", "desc")
    .limit(Settings.MAX_MESSAGES);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [inputText, setInputText] = useState("");
  const [windowHeight, setWindowHeight] = useState();

  const scrollToBottom = (scrollBehavior) => {
    messageBottom.current.scrollIntoView({
      behavior: scrollBehavior || "auto",
    });
  };

  // Listen to window resize (for when mobile user opens soft keyboard)
  useEffect(() => {
    const onWindowResize = (e) => {
      let newWindowHeight = window.innerHeight;
      if (newWindowHeight < windowHeight || !windowHeight)
        setTimeout(scrollToBottom, Settings.SOFT_KEYBOARD_OPEN_DELAY);
      setWindowHeight(newWindowHeight);
    };

    window.addEventListener("resize", onWindowResize);

    return () => {
      window.addEventListener("resize", onWindowResize);
    };
  }, [windowHeight]);

  // Scroll the message window to the bottom when a message comes in
  useEffect(() => {
    scrollToBottom("smooth");
    markMessagesRead();
  }, [messages]);

  const onFormChange = (e) => {
    setInputText(e.target.value);
  };

  // TODO Since posting the user's message is asyncronous, perhaps disable the send button while we wait?
  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL, displayName } = auth.currentUser;

    await messagesRef.add({
      text: inputText,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL,
      unread: true,
    });

    setInputText("");
  };

  return (
    <>
      <div className={"messageWindow"}>

        {getMessageComponents(messages)}

        <div ref={messageBottom}></div>
      </div>

      <form onSubmit={sendMessage}>
        <input
          value={inputText}
          onChange={onFormChange}
          placeholder="Type here..."
          maxLength="500"
          autoComplete="off"
          required
        />
        <button type="submit">Send</button>
      </form>
    </>
  );
}

// SINGLE MESSAGE COMPONENT
function ChatMessage(props) {
  const { text, uid, photoURL, createdAt, displayName, unread, system } = props.message;
  const messageClass = getMessageType(uid, auth.currentUser.uid, unread, system);
  const [playBoop] = useSound(boopSound, { interrupt: true });

  return (
    <div className={`message ${messageClass}`}>
      <img
        src={photoURL}
        alt=""
        onLoad={() => {
          if (props.last) playBoop();
        }}
        onClick={() =>
          alert((displayName || uid) + "\n\nSent: " + createdAt.toDate())
        }
      />
      <p>{text}</p>
      <img className="seen" src='seen.png' alt="" />
    </div>
  );
}

// Returns an array of chat message components for the given data
function getMessageComponents(messages) {
  return messages && 
    messages.slice(0)
    // addSystemMessages(messages)
    .sort((a, b) => getTimeFromMessage(a) - getTimeFromMessage(b))
    .filter((i,idx,arr) => !i.system || (idx < arr.length-1 && i.system !== arr[idx+1].system))
    .map((msg, index) => (
      <ChatMessage
        key={msg.id}
        message={msg}
        last={messages.length - 1 === index}
      />
    ));
}

function addSystemMessages(messages) {
  const output = messages.slice(0);

  const oldest = getTimeFromMessage(messages[messages.length-1]);
  const newest = getTimeFromMessage(messages[0]);
  let current = newest;
  current -= current % (5*60*1000); // round down to nearest 5 minutes

  let i = 0;
  while (current > oldest) {
  
    // Add a test system message into the data
    const time = current;
    const date = new Date(time);
    const timestamp = firebase.firestore.Timestamp.fromDate(date);
    const message = {
      id: 'timeindicator' + Math.random(),
      text: timestamp.toDate().toString().split(' ').slice(0, 5).join(' '),
      createdAt: timestamp,
      uid: '-1',
      photoURL: '',
      displayName: 'SYSTEM',
      unread: false,
      system: true
    }
    output.push(message);

    i++;
    current -= 3600 * 1000;
  }
  console.log(i);

  return output;
}

function getTimeFromMessage(message) {
  if (!message || !message.createdAt) return 0;
  return message.createdAt.toDate().getTime();
}

// Returns the relevant style class for a given message
function getMessageType(uidMessage, uidUser, unread, system) {
  if (system) return "fromsystem";
  const isMe = uidMessage === uidUser;
  if (isMe && !unread) return "read";
  return isMe ? "sent" : "received";
}

// Updates any unread messages not from the current user as read using a batch database operation
function markMessagesRead() {
  const batch = firestore.batch();

  firestore
    .collection("messages")
    .where("uid", "!=", auth.currentUser.uid)
    .where("unread", "==", true)
    .limit(Settings.MAX_MESSAGES)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // console.log(doc.id, " => ", doc.data());
        batch.update(doc.ref, { unread: false });
      });
      batch.commit();
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });
}

export default App;
