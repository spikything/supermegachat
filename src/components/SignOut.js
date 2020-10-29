const SignOut = (props) => {
  const {auth} = props;
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign out</button>
  );
}

export default SignOut;
