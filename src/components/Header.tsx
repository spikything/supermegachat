import ThemeSwitch from "./ThemeSwitch";
import SignOut from "./SignOut";
import { motion } from "framer-motion";

const Header = (props: {auth:firebase.auth.Auth}) => {
  const {auth} = props;

  return (
    auth.currentUser && (
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >

        <img 
          src={auth.currentUser.photoURL || 'user.png'}
          className="avatar"
          alt="avatar"
          referrerPolicy="no-referrer"
        />

        <h2>{auth.currentUser.displayName?.split(' ')[0]}</h2>

        <ThemeSwitch {...{style:'label'}} />
        
        <SignOut auth={auth} />
        
      </motion.header>
    )
  );
}

export default Header;
