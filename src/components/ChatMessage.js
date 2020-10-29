import useSound from "use-sound";
import boopSound from "../menu-open.mp3";

const ChatMessage = (props) => {
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
    auth.currentUser.uid,
    unread,
    system
  );
  const [playBoop] = useSound(boopSound, { interrupt: true });

  return (
    <div className={`message ${messageClass}`}>
      <img
        src={photoURL}
        alt=""
        onLoad={() => {
          if (props.last) playBoop();
        }}
        onClick={() =>
          alert((displayName || uid) + "\n\nSent: " + createdAt.toDate())
        }
      />
      <p>{text}</p>
      <img className="seen" src="seen.png" alt="" />
    </div>
  );
};

// Returns the relevant style class for a given message
function getMessageType(uidMessage, uidUser, unread, system) {
  if (system) return "fromsystem";
  const isMe = uidMessage === uidUser;
  if (isMe && !unread) return "read";
  return isMe ? "sent" : "received";
}

export default ChatMessage;
