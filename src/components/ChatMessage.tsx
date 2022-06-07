import firebase from "firebase";
import { IMessage } from "../interfaces";

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
      <img
        src={photoURL || 'user.png' }
        alt="avatar"
        onClick={() =>
          alert((displayName || uid) + "\n\nSent: " + createdAt.toDate())
        }
        referrerPolicy="no-referrer"
      />
      <p>{text}</p>
      <img className="seen" src="seen.png" alt="seen" />
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
