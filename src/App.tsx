import { useEffect, Suspense, lazy } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import Strings from "./Strings";
import Settings from "./Settings";
import ThemeSwitch from "./components/ThemeSwitch";
import Header from "./components/Header";
import SignIn from "./components/SignIn";
import ErrorFallback from "./components/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { motion } from "framer-motion";
import "./styles/App.css";
const ChatRoom = lazy(() => import("./components/ChatRoom"));

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

          // User is logged in, but ChatRoom is lazy loaded, so needs wrapping in a Suspense block
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={ () => {
            window.location.reload();
          } }>
            <Suspense fallback={<div className="loader">⏳</div>}>
              <ChatRoom
                Settings={Settings}
                auth={auth}
                firestore={firestore}
              />
            </Suspense>
          </ErrorBoundary>

        ) : (

          // User is not logged in, display a welcome screen
          // TODO: Extract this to a WelcomeScreen component
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
