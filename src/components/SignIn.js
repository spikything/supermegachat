const SignIn = (props) => {
  const auth = props.auth;
  const firebase = props.firebase;
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <button className="sign-in" onClick={signInWithGoogle}>
      Sign into MegaChat with Google
    </button>
  );
};

export default SignIn;
