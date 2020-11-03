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

  return (
    <div className={`message ${messageClass}`}>
      <img
        src={photoURL}
        alt=""
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
