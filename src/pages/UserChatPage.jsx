import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router";
import ChatForm from "../components/ChatForm";
import ListUser from "../components/ListUser";
import { getMessages, sendMessage } from "../util/message.server";
import { getCurrentUser, getUser } from "../util/user.server";

export default function UserChatPage() {
  const userId = localStorage.getItem("user");
  const [otherUser, setOtherUser] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [messages, setMessages] = useState({});
  const params = useParams();

  useEffect(() => {
    async function fetchUsers() {
      const dataOtherUser = await getUser(params.id);
      if (dataOtherUser.status === 200) {
        setOtherUser(dataOtherUser.fields);
      }
      const dataThisUser = await getCurrentUser(userId);
      if (dataThisUser.status === 200) {
        setCurrentUser(dataThisUser.fields);
      }
      const dataMessages = await getMessages(userId, params.id);
      console.log(dataMessages);
      if (dataMessages.status === 200) {
        setMessages(dataMessages);
      }
    }
    fetchUsers();
  }, [params.id, userId]);

  async function handleSubmit(message) {
    //TODO: Show loader
    // present();

    const result = await sendMessage(message);
    console.log(result);

    if (result.status === 200) {
      // history.push("/home");
      // await Toast.show({
      //   text: result.message,
      //   position: "center",
      //   duration: "short",
      // });

      const dataOtherUser = await getUser(params.id);
      if (dataOtherUser.status === 200) {
        setOtherUser(dataOtherUser.fields);
      }
      const dataThisUser = await getCurrentUser(userId);
      if (dataThisUser.status === 200) {
        setCurrentUser(dataThisUser.fields);
      }
      const dataMessages = await getMessages(userId, params.id);
      if (dataMessages.status === 200) {
        setMessages(dataMessages);
      }

    } else {
      // await Toast.show({
      //   text: result.message,
      //   position: "center",
      //   duration: "long",
      // });
    }
    //TODO: Hide loader
    // dismiss();

  }

  if (!userId) {
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
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{`${otherUser.firstName} ${otherUser.lastName}`}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {messages.fields &&
          messages.fields.map((message) => <ListUser key={message.id} message={message} />)}
        <ChatForm
          handleSubmit={handleSubmit}
          user1={userId}
          user2={params.id}
        />
      </IonContent>
    </IonPage>
  );
}
