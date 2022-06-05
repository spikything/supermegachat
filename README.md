# SuperMegaChat

A simple Facebook Messenger Group chat like Web App, built on **React** (hooks) using **Firebase** for authentication and **Firestore** for storage. It includes reasonably robust **firestore rules** for security, a few **unit tests** and comprehensive end-to-end automated testing with **WebDriver** and the **Firebase Local Emulator Suite**.

[![SuperMegaChat](https://i0.wp.com/www.spikything.com/blog/wp-content/uploads/2022/03/supermegachat.webp)](https://www.spikything.com/blog/index.php/2020/06/02/chat-app-in-react-hooks/)

## Building

The usual dev and build npm scripts are available. [Create your own Firebase project](https://cloud.google.com/firestore/docs/client/get-firebase) with a Firestore Database (not realtime database), Google Auth (and optionally email/pass auth) enabled. You will also need to create your own `.env` file in the project's root directory, with the relevant Firebase keys and WebDriver settings. Use `.env.template` as a starting point:
~~~~
# Firebase credentials

REACT_APP_FIREBASE_API_KEY = "............................."
REACT_APP_FIREBASE_AUTH_DOMAIN = "superchat..........firebaseapp.com"
REACT_APP_FIREBASE_DATABASE_URL = "https://superchat.........firebaseio.com"
REACT_APP_FIREBASE_PROJECT_ID = "superchat......."
REACT_APP_FIREBASE_STORAGE_BUCKET = "superchat..........appspot.com"
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = ".............."
REACT_APP_FIREBASE_APP_ID = ".................................."
REACT_APP_FIREBASE_MEASUREMENT_ID = ".............."

# Webdriver setup

CHROMEDRIVER_PATH = "PATH/TO/chromedriver.exe"
APP_URL = "http://localhost:3000"
TEST_USER = "tester@tester.com"
TEST_PASS = "tester"
~~~~
Note that TEST_USER and TEST_PASS are only needed if you switch authentication from `signInWithPopup` to use `signInWithEmailAndPassword`. You may wish to do this to enable users without a Google account to register, or to provision the Firebase auth emulator with a user account to test email/pass authentication.

### `npm start`

Runs the app in the development mode, then available (by default) at [http://localhost:3000](http://localhost:3000)

### `npm test`

Launches the test runner in interactive watch mode.\
\
There are just a few basic tests using Jest and React Testing Library.

### E2E testing

An automated Selenium WebDriver test script is available in the `webdriver` folder. Refer to the test script in that folder for setup info. Basically, you need to install **Python**, **WebDriver** and the **Firebase Local Emulator Suite**, update your `.env` chromedriver path, then: 
~~~~
# Start the Firebase emulators
firebase emulators:start

# Open a separate terminal and start the dev server
npm start

# Open yet another terminal and run the WebDriver test script
cd webdriver
python ./TestSuperMegaChat.py
~~~~

### `npm run build`

Builds the app for production to the `build` folder.\

### `firebase login`

Will authenticate your local terminal with Firebase.\

### `firebase deploy`

Will deploy your latest build to the production server, which will normally be `https://your-project-id.web.app`
