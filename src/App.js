import React, { useRef, useEffect, useState } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyACHocPkDUzh59OfnqXtfx0SkvaKHEfrmA",
  authDomain: "superchat-11bdc.firebaseapp.com",
  databaseURL: "https://superchat-11bdc.firebaseio.com",
  projectId: "superchat-11bdc",
  storageBucket: "superchat-11bdc.appspot.com",
  messagingSenderId: "206674897831",
  appId: "1:206674897831:web:a33e919945e6ed554b6482",
  measurementId: "G-201RN4JJRW"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  // Google Authentication
  const [user] = useAuthState(auth);

  // Disable pinch zooming
  const useDisablePinchZoomEffect = () => {
    useEffect(() => {
      const disablePinchZoom = (e) => {
        if (e.touches.length > 1) {
          e.preventDefault()
        }
      }
      document.addEventListener("touchmove", disablePinchZoom, { passive: false })
      return () => {
        document.removeEventListener("touchmove", disablePinchZoom)
      }
    }, [])
  }
  useDisablePinchZoomEffect();

  // CONSTRUCT APP
  return (
    <div className="App">

      { user ? <Header /> : null }

      <section>
        { user ? <ChatRoom /> : <SignIn /> }
      </section>

    </div>
  );
}

function SignIn () {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button className="sign-in" onClick={signInWithGoogle}>Sign into MegaChat with Google</button>
  )
}

function Header () {
  return auth.currentUser && (
    <header>
      <img src={ auth.currentUser.photoURL || 'https://lh3.googleusercontent.com/fife/ABSRlIphM2hawV2AzwI5CEphA9pmHalAjD5pYdiLKYT2PMULhdUKQ5d6vxakdSBF1CSq8XoG0d0a9RGJp3iwAVYizt7sleGdBp5ltpG03Q7SW8pi3OEmaIqsar75CU9rIj5g8S9hPR6BjCNWaIBuptJDmzVHR4yE43fuWx1VRg8ITMXg7__PuodYGemf9_J0UYTBuRRr8hxJc4kT6nleESBisdIjmupgaj7eXU0Cq6DenzcwS9TDOmQM5dzDIlR4goowjejdREdtUJff3neOf8wt5asWiIUoTsYMMJRJAncPdv7CFLZ79AEtxJa2ZBNv9DEXY-E50Cdg8IUS4-cVrIXO2uA52AzKhylu0c9iK9gg1cr3e0JLRU91-jq3oKk8I-6rD5wVK6bm4OK7jQ7Qg-Zzee1_CjFBFImXUddZhetObZniSB1RtE1nDT_RUoqsKh-LSV5cYu0jUHH62f5lATcM4d8sJFqkR_qWXxTnLcv0xoVaZSHCqP9L7BxVm_XVA1J9BGSfy21cnEr7k-Zmhcu_HVazv1l74J7cJWRJiUIn9goxy2bWWi7YZWVyFllMoLnlhSLjLrCcnp3bx901CnXE38ZTbvbtnaZhJDthk8tQ44RhjB-Fnbpjm7IkNuKd0iBDlbSHXD0RWvphCfSbZKVcumYLxhLwoNfkhZjpEdnLceSD8aUNrL0JA_H2_dNgVA5pvdh9d1Vw0aNBxc8LPFDKSXiTE5HQv4LT=s5184-w5184-h2916-no' } alt='' />
      <h2>{ auth.currentUser.displayName }</h2>
    <SignOut />
  </header>
  )
}

function SignOut () {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign out</button>
  )
}

function ChatRoom () {

  const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt', 'desc').limit(250);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid, photoURL, displayName } = auth.currentUser;

    await messagesRef.add({
	  text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL
    });

    setFormValue('');
    //dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  // useEffect(() => {
  //   dummy.current.scrollIntoView({ behavior: "smooth" })
  // }, [])

  return (
    <>
      <div className={`messageWindow`}>
        {messages && messages.reverse().map(msg => <ChatMessage key={msg.id} message={msg} /> )}

        <div id="messageBottom" ref={dummy}></div>
      </div>

      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={ (e) => setFormValue(e.target.value) } placeholder="Type here..." maxLength="500" />
        <button type="submit">SEND</button>
      </form>

    </>
  )
}

function ChatMessage (props) {

  // The dummy ref trick doesn't seem to respond to all incoming data. So use an environment variable to update scrolling once after a timeout
  // const dummy = useRef();
  clearTimeout(process.env.UPDATE_TIMEOUT);
  process.env.UPDATE_TIMEOUT = setTimeout(() => { document.getElementById('messageBottom').scrollIntoView({ behavior: 'smooth' }); }, 100);

  const { text, uid, photoURL, createdAt, displayName } = props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img src={ photoURL } alt='' onClick={ () => alert((displayName || uid) + '\n\nSent: ' + createdAt.toDate()) } />
      <p>{text}</p>
    </div>
  );
}

export default App;
