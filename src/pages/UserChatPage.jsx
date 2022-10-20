import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonViewWillEnter,
} from "@ionic/react";
import { useState } from "react";
import { useParams } from "react-router";
import ChatForm from "../components/ChatForm";
import { onSnapshot } from "firebase/firestore";
import { auth } from "../util/firebase";
import ChatMessage from "../components/ChatMessage";
import { getUser } from "../util/user.server";
import { createMessage, deleteMessage, messageQuery } from "../util/message.server";
import { Toast } from "@capacitor/toast";

export default function UserChatPage() {
  const [otherUser, setOtherUser] = useState({});
  const [messages, setMessages] = useState([]);
  const params = useParams();
  const [present, dismiss] = useIonLoading();

  useIonViewWillEnter(() => {
    fetchUser();
    fetchMessages();
  });

  async function fetchUser() {
    // Getting the user we are chatting with and setting state
    const userResult = await getUser(params.id);
    if (userResult.status === 200 && userResult.data) {
      setOtherUser(userResult.data);
    }
  }
  async function fetchMessages() {
    if (auth.currentUser) {
      // In the following lines we are getting all the messages and also listening for any new messages.
      const q = messageQuery(auth.currentUser.uid, params.id);
      // Attaching a listener so new messages are displayed immediately
      onSnapshot(q, (querySnapshot) => {
        // Pushing each user from the collection to a temporary array
        let tempMessages = [];
        querySnapshot.forEach((doc) => {
          const id = doc.id;
          tempMessages.push({ id, ...doc.data() });
        });
        // Setting the users with our temporary array
        setMessages(tempMessages);
      });
    }
  }

  async function handleSubmit(message) {
    present();
    // Sending the message
    const result = await createMessage(auth.currentUser.uid, otherUser.uid, message);
    await Toast.show({
      text: result.message,
      position: "center",
      duration: "long",
    });

    dismiss();
  }

  async function handleDelete(messageId) {
    present();

    const result = await deleteMessage(auth.currentUser.uid, otherUser.uid, messageId);
    await Toast.show({
      text: result.message,
      position: "center",
      duration: "long",
    });
    dismiss();
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
        {auth.currentUser && <ChatForm handleSubmit={handleSubmit} user1={auth.currentUser.uid} user2={params.id} />}
        <div className="spacer"></div>
      </IonContent>
    </IonPage>
  );
}
