import Strings from "../Strings";

const SignOut = (props: {auth:firebase.auth.Auth}) => {
  const {auth} = props;
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>
      {Strings.SIGN_OUT_LABEL}
    </button>
  );
}

export default SignOut;
