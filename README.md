# SuperMegaChat

A simple Facebook Messenger Group chat like Web App, built on React (hooks) using Firebase for Google Authentication and Firestore for storage (with a few security rules thrown in).

## Building

The usual dev and build npm scripts are available. But, for security and environment setup reasons, you will first need to create your own `.env` file in the project's root directory, with the various Firebase keys and WebDriver settings. This should take the form:\
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

CHROMEDRIVER_PATH="C:/path/po/chromedriver/chromedriver.exe"
APP_URL="https://..............."
TEST_EMAIL="................"
~~~~

### `npm start`

Runs the app in the development mode, then available at [http://localhost:3000](http://localhost:3000)

### `npm test`

Launches the test runner in interactive watch mode.\
\
There are just a few basic tests using Jest and React Testing Library.

### WebDriver test

There is a basic Selenium WebDriver test in the `webdriver` folder. Neither Chromedriver nor Geckodriver will let you authenticate by automation now though, so it just tests for that currently until I've solved that.

### `npm run build`

Builds the app for production to the `build` folder.\

### `firestore deploy`

Assuming you have logged into firestore via the console, will deploy the latest build to the production server.
