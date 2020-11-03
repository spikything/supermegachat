import React, { useState, useRef, useEffect } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";

import ChatMessage from "./ChatMessage";

import useSound from "use-sound";
import boopSound from "../menu-open.mp3";

const ChatRoom = (props) => {
  const { Settings, auth, firebase, firestore } = props;
  const messageBottom = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef
    .orderBy("createdAt", "desc")
    .limit(Settings.MAX_MESSAGES);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [inputText, setInputText] = useState("");
  const [windowHeight, setWindowHeight] = useState();
  const [playBoop] = useSound(boopSound, { interrupt: true });

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
  }, [windowHeight, Settings.SOFT_KEYBOARD_OPEN_DELAY]);

  // Scroll the message window to the bottom when a message comes in
  useEffect(() => {
    playBoop();
    scrollToBottom("smooth");
    markMessagesRead(Settings, auth, firestore);
  }, [messages, playBoop, Settings, auth, firestore]);

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

  // The component JSX to render
  return (
    <>
      <div className={"messageWindow"}>
        {getMessageComponents(Settings, firebase, auth, messages)}

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
};

// Returns an array of chat message components for the given data
function getMessageComponents(Settings, firebase, auth, messages) {
  return (
    messages &&
    addSystemMessages(Settings, firebase, messages)
      .sort((a, b) => getTimeFromMessage(a) - getTimeFromMessage(b))
      .filter(
        (i, idx, arr) =>
          !i.system ||
          (idx < arr.length - 1 && i.system !== arr[idx + 1].system)
      )
      .map((msg, index) => (
        <ChatMessage
          auth={auth}
          key={msg.id}
          message={msg}
          last={messages.length - 1 === index}
        />
      ))
  );
}

function addSystemMessages(Settings, firebase, messages) {
  if (!Settings.SYSTEM_MESSAGES_ENABLED) return messages;

  const output = messages.slice(0);
  const oldest = getTimeFromMessage(messages[messages.length - 1]);
  const newest = getTimeFromMessage(messages[0]);
  let current = newest;
  current -= current % (5 * 60 * 1000); // round down to nearest 5 minutes

  let i = 0;
  while (current > oldest) {
    // Add a test system message into the data
    const time = current;
    const date = new Date(time);
    const timestamp = firebase.firestore.Timestamp.fromDate(date);
    const message = {
      id: "timeindicator" + Math.random(),
      text: timestamp.toDate().toString().split(" ").slice(0, 5).join(" "),
      createdAt: timestamp,
      uid: "-1",
      photoURL: "",
      displayName: "SYSTEM",
      unread: false,
      system: true,
    };
    output.push(message);

    i++;
    current -= 3600 * 1000;
  }

  if (Settings.LOGGING_ENABLED) console.log(i + " system messages added");

  return output;
}

function getTimeFromMessage(message) {
  if (!message || !message.createdAt) return 0;
  return message.createdAt.toDate().getTime();
}

// Updates any unread messages not from the current user as read using a batch database operation
function markMessagesRead(Settings, auth, firestore) {
  const batch = firestore.batch();

  firestore
    .collection("messages")
    .where("uid", "!=", auth.currentUser.uid)
    .where("unread", "==", true)
    .limit(Settings.MAX_MESSAGES)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (Settings.LOGGING_ENABLED) console.log(doc.id, " => ", doc.data());

        batch.update(doc.ref, { unread: false });
      });
      batch.commit();
    })
    .catch(function (error) {
      if (Settings.LOGGING_ENABLED)
        console.log("Error getting documents: ", error);
    });
}

export default ChatRoom;
