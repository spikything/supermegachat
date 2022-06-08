import firebase from "firebase/app";
import "firebase/auth";
import Settings from "../Settings";
import Strings from "../Strings";
import { motion } from "framer-motion";

function handleError(err:Error) {
  alert(Strings.SIGN_IN_ERROR + "\n\n" + err.message);
}

const SignIn = (props: {auth:firebase.auth.Auth}) => {
  const { auth } = props;
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    if (Settings.isLocal && Settings.USER_PASS_AUTH_ENABLED)
    {
      auth.signInWithEmailAndPassword(Settings.TEST_USER!, Settings.TEST_PASS!)
      .catch(handleError);
    }
    else
    {
      auth.signInWithPopup(provider)
      .catch(handleError);
    }
  };

  return (
    <motion.button 
      className="sign-in" 
      onClick={signInWithGoogle}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {Strings.SIGN_IN_LABEL}
    </motion.button>
  );
};

export default SignIn;
