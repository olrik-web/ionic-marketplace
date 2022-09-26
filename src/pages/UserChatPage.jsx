import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { Redirect, useParams } from "react-router";
import ChatForm from "../components/ChatForm";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../util/firebase";
import { AuthContext } from "../context/auth";
import ChatMessage from "../components/ChatMessage";
import { getUser } from "../util/user.server";

export default function UserChatPage() {
  const [otherUser, setOtherUser] = useState({});
  // const [currentUser, setCurrentUser] = useState({});
  const [messages, setMessages] = useState([]);
  const params = useParams();
  const { user } = useContext(AuthContext);
  let docId;
  if (user) {
    docId =
      auth.currentUser.uid > otherUser.uid
        ? auth.currentUser.uid + otherUser.uid
        : otherUser.uid + auth.currentUser.uid;
  }

  useEffect(() => {
    async function fetchUser() {
      const userResult = await getUser(params.id);
      if (userResult.status === 200 && userResult.data) {
        setOtherUser(userResult.data);
      }

      // In the following lines we are getting all the messages and also listening for any new messages.
      //TODO: Can we move this function into message.server.js? Will it still work???
      const messagesRef = collection(db, "messages", docId, "chat");
      // Quering the users collection without the current user.
      const q = query(messagesRef, orderBy("createdAt", "asc"));
      onSnapshot(q, (querySnapshot) => {
        // Pushing each user from the collection to a temporary array
        let tempMessages = [];
        querySnapshot.forEach((doc) => {
          const id = doc.id;
          tempMessages.push({ id, ...doc.data() });
        });
        // Setting the users with out temporary array
        setMessages(tempMessages);
      });
    }
    fetchUser();
    // }, [params.id, userId]);
  }, [params.id, docId]);

  async function handleSubmit(message) {
    //TODO: Do we need to prevent default in this submit???

    //TODO: Show loader
    // present();

    //TODO: Move function to messages.server.js
    const result = await addDoc(collection(db, "messages", docId, "chat"), message);
    console.log(result);

    //TODO: Show error message if message wasn't sent

    // if (result.status === 200) {
    //   // history.push("/home");
    //   // await Toast.show({
    //   //   text: result.message,
    //   //   position: "center",
    //   //   duration: "short",
    //   // });
    // } else {
    //   // await Toast.show({
    //   //   text: result.message,
    //   //   position: "center",
    //   //   duration: "long",
    //   // });
    // }
    //TODO: Hide loader
    // dismiss();

    // Scroll to bottom of IonContent, so the new message is in view
    scrollToBottom();
  }

  async function handleDelete(messageId) {
    await deleteDoc(doc(db, "messages", docId, "chat", messageId));
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Chats" defaultHref="/chats"></IonBackButton>
          </IonButtons>
          <IonTitle>{`${otherUser.firstName} ${otherUser.lastName}`}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        fullscreen
        scrollEvents={true}
        onIonScrollStart={() => {}}
        onIonScroll={() => {}}
        onIonScrollEnd={() => {}}
      >
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{`${otherUser.firstName} ${otherUser.lastName}`}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {messages &&
          messages.map((message) => (
            <ChatMessage
              handleDelete={() => handleDelete(message.id)}
              key={message.id}
              otherUser={otherUser}
              message={message}
            />
          ))}
        <ChatForm handleSubmit={handleSubmit} user1={auth.currentUser.uid} user2={params.id} />
        <div className="spacer"></div>
      </IonContent>
    </IonPage>
  );
}

function getContent() {
  return document.querySelector("ion-content");
}

function scrollToBottom() {
  getContent().scrollToBottom(500);
}
