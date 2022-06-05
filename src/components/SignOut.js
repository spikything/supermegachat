import Settings from "../Settings";

const SignOut = (props) => {
  const {auth} = props;
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>
      {Settings.SIGN_OUT_LABEL}
    </button>
  );
}

export default SignOut;
