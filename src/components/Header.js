import SignOut from "./SignOut";

const Header = (props) => {
  const {auth} = props;

  return (
    auth.currentUser && (
      <header>
        <img src={auth.currentUser.photoURL} alt="" />

        <h2>{auth.currentUser.displayName}</h2>

        <SignOut auth={auth} />
      </header>
    )
  );
}

export default Header;
