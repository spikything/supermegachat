import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import Settings from "./Settings";
import ChatRoom from "./components/ChatRoom";
import Header from "./components/Header";
import SignIn from "./components/SignIn";

import "./App.css";

firebase.initializeApp(Settings.FIREBASE_INIT_OBJECT);

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

  // The component JSX to render
  return (
    <div className="App">
      {user ? <Header auth={auth} /> : null}

      <section>
        {user ? (
          <ChatRoom
            Settings={Settings}
            auth={auth}
            firebase={firebase}
            firestore={firestore}
          />
        ) : (
          <SignIn auth={auth} firebase={firebase} />
        )}
      </section>
    </div>
  );
}

export default App;
