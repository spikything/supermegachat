import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import Settings from "./Settings";
import ChatRoom from "./components/ChatRoom";
import ThemeSwitch from "./components/ThemeSwitch";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import Strings from "./Strings";
import { motion } from "framer-motion";
import "./styles/App.css";

// Firebase initilisation
const fsapp = firebase.initializeApp(Settings.FIREBASE_INIT_OBJECT);
if (Settings.isLocal && Settings.USE_EMULATOR_WHEN_LOCAL) {
  fsapp.auth().useEmulator(Settings.AUTH_EMULATOR);
  fsapp.firestore().settings({
    host: Settings.FIREBASE_EMULATOR,
    ssl: false,
  });
}

const auth = firebase.auth();
const firestore = firebase.firestore();
const signInScreenProps:{ style:string } = { style: 'label signin' }

function App() {

  // Google Firebase Authentication
  const [user] = useAuthState(auth);

  // Setup
  useEffect(() => {

    // Disable pinch zooming
    const disablePinchZoom = (evt:TouchEvent) => {
      if (evt.touches.length > 1) {
        evt.preventDefault();
      }
    };
    document.addEventListener("touchmove", disablePinchZoom, { passive: false });

    // Component teardown callback
    return () => {
      document.removeEventListener("touchmove", disablePinchZoom);
    };
  }, []);

  // The component JSX to render
  return (
    <div className="App">
      {user ? <Header auth={auth} /> : null}

      <section>
        {user ? (
          <ChatRoom
            Settings={Settings}
            auth={auth}
            firestore={firestore}
          />
        ) : (
          <>
            <motion.h1
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              {Strings.WELCOME}
            </motion.h1>
            <motion.img
              className="logo"
              src="logo512.png"
              alt="logo"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            />
            <SignIn 
              auth={auth} 
            />
            <ThemeSwitch {...signInScreenProps} />
          </>
        )}
      </section>
    </div>
  );
}

export default App;
