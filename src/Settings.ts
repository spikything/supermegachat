const Settings = {

  LOGGING_ENABLED: false,
  MAX_MESSAGES: 100,
  SOFT_KEYBOARD_OPEN_DELAY: 50,
  SYSTEM_MESSAGES_ENABLED: false,
  USER_PASS_AUTH_ENABLED: false,
  AUTH_EMULATOR: "http://localhost:9099",
  FIREBASE_EMULATOR: "localhost:8080",
  USE_EMULATOR_WHEN_LOCAL: false, // if you set this to true, ensure the firebase emulators are running for testing (firebase emulators:start)
  TEST_USER: process.env.TEST_USER,
  TEST_PASS: process.env.TEST_PASS,

  FIREBASE_INIT_OBJECT: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  },

  get isLocal() {
    return window.location.hostname === "localhost"
  }

};

export default Settings;
