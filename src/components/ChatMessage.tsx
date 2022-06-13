import { IMessage } from "../interfaces";
import Strings from "../Strings";
import { motion } from "framer-motion";

const ChatMessage = (props: {
  auth:firebase.auth.Auth,
  key:string,
  message:IMessage,
  last:boolean
}) => {

  const { auth } = props;

  const {
    text,
    uid,
    photoURL,
    createdAt,
    displayName,
    unread,
    system,
  } = props.message;

  const messageClass = getMessageType(
    uid,
    auth.currentUser!.uid,
    unread,
    system
  );

  return (
    <div className={`message ${messageClass}`}>

      <motion.img
        src={photoURL || 'images/user.png' }
        className="avatar messageimage"
        alt={Strings.IMAGE_ALT_USER}
        onClick={() =>
          alert((displayName || uid) + "\n\n" + Strings.MESSAGE_POPUP_PREFIX + createdAt.toDate())
        }
        referrerPolicy="no-referrer"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.2 }}
      />

      <motion.p
        initial={{ opacity: 0, x: messageClass === 'sent' ? -50 : 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.2 }}
      >
        {text}
      </motion.p>

      <img className="seen" src="images/seen.png" alt={Strings.IMAGE_ALT_SEEN} />

    </div>
  );
};

// Returns the relevant style class for a given message
function getMessageType(uidMessage:string, uidUser:string, unread:boolean, system:boolean) {
  if (system) return "fromsystem";
  const isMe = uidMessage === uidUser;
  if (isMe && !unread) return "read";
  return isMe ? "sent" : "received";
}

export default ChatMessage;
