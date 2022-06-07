import Settings from "../Settings";

function handleError(err) {
  alert("Sorry, could not log you in 😟\n\n" + err.message);
}

const SignIn = (props) => {
  const auth = props.auth;
  const firebase = props.firebase;
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    if (Settings.isLocal && Settings.USER_PASS_AUTH_ENABLED)
    {
      auth.signInWithEmailAndPassword(Settings.TEST_USER, Settings.TEST_PASS)
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
      {Settings.SIGN_IN_LABEL}
    </button>
  );
};

export default SignIn;
