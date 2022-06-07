import firebase from "firebase";
import Settings from "../Settings";
import Strings from "../Strings";

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
    <button className="sign-in" onClick={signInWithGoogle}>
      {Strings.SIGN_IN_LABEL}
    </button>
  );
};

export default SignIn;
