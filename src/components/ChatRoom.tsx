import React, { useState, useRef, useEffect, FormEvent, ChangeEvent } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "./ChatMessage";
import useSound from "use-sound";
import Filter from "bad-words";
import firebase from "firebase";
import { IMessage, ISettings } from "../interfaces";
import Strings from "../Strings";
import { motion } from "framer-motion";
const boopSound = require('../assets/menu-open.mp3');

const ChatRoom = (props: {Settings:ISettings, auth:firebase.auth.Auth, firestore:firebase.firestore.Firestore}) => {

  const {
    Settings,
    auth,
    firestore
  } = props;

  const messageBottom = useRef<HTMLDivElement>(null);
  const messagesRef = firestore.collection("messages");
  const query = messagesRef
    .orderBy("createdAt", "desc")
    .limit(Settings.MAX_MESSAGES);
  const [messages] : [IMessage[] | undefined, boolean, Error | undefined] = useCollectionData(query, { idField: "id" });
  const [inputText, setInputText] = useState("");

  const [
    windowHeight,
    setWindowHeight
  ] : [
    windowHeight:number | undefined,
    setWindowHeight:Function
  ] = useState();

  const [playBoop] = useSound(boopSound, { interrupt: true });
  const filter = new Filter( {placeHolder:Strings.BAD_WORD_REPLACEMENT} );

  // For scrolling the message area to the bottom
  const scrollToBottom = (scrollBehavior:ScrollBehavior) => {
    if (messageBottom && messageBottom.current)
    {
      messageBottom.current.scrollIntoView({
        behavior: scrollBehavior || "auto",
      });
    }

  };

  // Listen to window resize (for when mobile user opens soft keyboard)
  useEffect(() => {
    const onWindowResize = (evt:Event) => {
      let newWindowHeight = window.innerHeight;
      if (newWindowHeight < windowHeight! || !windowHeight)
        setTimeout(scrollToBottom, Settings.SOFT_KEYBOARD_OPEN_DELAY);
      setWindowHeight(newWindowHeight);
    };

    window.addEventListener("resize", onWindowResize);

    return () => {
      window.addEventListener("resize", onWindowResize);
    };
  }, [windowHeight, Settings.SOFT_KEYBOARD_OPEN_DELAY]);

  // When 'messages' updates (i.e. when a message is received or deleted)
  useEffect(() => {
    playBoop();
    scrollToBottom("smooth");
    markMessagesRead(Settings, auth, firestore);
  }, [messages, playBoop, Settings, auth, firestore]);

  // Update the input text state as the input field is updated
  const onFormChange = (evt:ChangeEvent<HTMLInputElement>) => {
    setInputText(evt.target.value);
  };

  // Submit the user's message
  const sendMessage = async (evt:FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const { uid, photoURL, displayName } = auth.currentUser!;

    await messagesRef.add({
      text: filter.clean(inputText),
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
      <motion.div
        className={"messageWindow"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {getMessageComponents(Settings, auth, messages)}

        <div ref={messageBottom}></div>
      </motion.div>

      <motion.form
        onSubmit={sendMessage}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        <input
          value={inputText}
          onChange={onFormChange}
          placeholder={Strings.INPUT_PLACEHOLDER}
          maxLength={500}
          autoComplete="off"
          required
        />
        <button type="submit">Send</button>
      </motion.form>
    </>
  );
};

// Returns an array of chat message components for the given data
function getMessageComponents(Settings:ISettings, auth:firebase.auth.Auth, messages:IMessage[] | undefined) {
  return (
    messages &&
    addSystemMessages(Settings, messages)
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

function addSystemMessages(Settings:ISettings, messages:IMessage[]) {
  if (!Settings.SYSTEM_MESSAGES_ENABLED) return messages;

  const output = messages.slice(0);
  const oldest = getTimeFromMessage(messages[messages.length - 1]);
  const newest = getTimeFromMessage(messages[0]);
  let current = newest;
  current -= current % (5 * 60 * 1000); // round down to nearest 5 minutes

  let i = 0;
  while (current > oldest) {
    const time = current;
    const date = new Date(time);
    const timestamp = firebase.firestore.Timestamp.fromDate(date);
    const message = {
      id: "timeindicator" + i++,
      text: timestamp.toDate().toString().split(" ").slice(0, 5).join(" "),
      createdAt: timestamp,
      uid: "-1",
      photoURL: "",
      displayName: "SYSTEM",
      unread: false,
      system: true,
    };
    output.push(message);

    current -= 3600 * 1000;
  }

  return output;
}

function getTimeFromMessage(message:IMessage) {
  if (!message || !message.createdAt) return 0;
  return message.createdAt.toDate().getTime();
}

// Marks any unread messages not from the current user as read in one fast batch database operation
function markMessagesRead(Settings:ISettings, auth:firebase.auth.Auth, firestore:firebase.firestore.Firestore) {
  const batch = firestore.batch();

  firestore
    .collection("messages")
    .where("uid", "!=", auth.currentUser!.uid)
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
