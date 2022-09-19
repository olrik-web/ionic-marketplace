import { IonItem, IonLabel, IonAvatar, IonImg } from "@ionic/react";
import { useEffect, useState } from "react";
import { getUser } from "../util/user.server";

export default function ListUser({ user, chatView, message }) {
  const defaultImg =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";
  const [sender, setSender] = useState({});

  useEffect(() => {
    async function fetchUser() {
      if (message) {
        const dataSender = await getUser(message.sender);
        setSender(dataSender);
      }
    }
    fetchUser();
  }, [message]);

  if (message) {
    if (sender.fields) {
      return (
        <IonItem>
          <IonAvatar slot="start">
            <IonImg
              src={sender.fields.image ? sender.fields.image : defaultImg}
            />
          </IonAvatar>
          <IonLabel>
            <h2>{`${sender.fields.firstName} ${sender.fields.lastName}`} </h2>
            <p>{message.text}</p>
          </IonLabel>
        </IonItem>
      );
    } else {
      return <></>;
    }
  }
  if (chatView) {
    return (
      <IonItem key={user.id}>
        <IonAvatar slot="start">
          <IonImg src={user.image ? user.image : defaultImg} />
        </IonAvatar>
        <IonLabel>
          <h2>{`${user.firstName} ${user.lastName}`} </h2>
        </IonLabel>
      </IonItem>
    );
  }
  return (
    <IonItem key={user.id} button routerLink={`chats/${user.id}`}>
      <IonAvatar slot="start">
        <IonImg src={user.image ? user.image : defaultImg} />
      </IonAvatar>
      <IonLabel>
        <h2>{`${user.firstName} ${user.lastName}`} </h2>
        <p>
          <small>{user.email}</small>
        </p>
      </IonLabel>
    </IonItem>
  );
}
