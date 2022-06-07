import firebase from "firebase";
import SignOut from "./SignOut";

const Header = (props: {auth:firebase.auth.Auth}) => {
  const {auth} = props;

  return (
    auth.currentUser && (
      <header>
        <img 
          src={auth.currentUser.photoURL || 'user.png'} 
          alt="avatar" 
          referrerPolicy="no-referrer"
        />

        <h2>{auth.currentUser.displayName}</h2>

        <SignOut auth={auth} />
      </header>
    )
  );
}

export default Header;