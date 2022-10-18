import { IonItem, IonLabel, IonAvatar, IonImg } from "@ionic/react";
import { useEffect, useState } from "react";
import { timeConverter } from "../util/helperMethods";

export default function ListUser({ selectedUser, chatView }) {
  const [lastOnlineTime, setLastOnlineTime] = useState();
  const [lastOnlineMessage, setLastOnlineMessage] = useState();

  const defaultImg = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";

  useEffect(() => {
    if (selectedUser && selectedUser.lastOnline) {
      /*
       * timeConverter function takes a timestamp and returns either a precise date e.g. 19/9/2022 18:30 or
       * the difference between the timestamp and the current time in minutes, hours, days, months or years.
       */
      const timeConversion = timeConverter(selectedUser.lastOnline, false);
      if (timeConversion.message === "A few seconds ago...") {
        setLastOnlineTime("");
        setLastOnlineMessage(timeConversion.message);
      } else {
        setLastOnlineTime(timeConversion.time);
        setLastOnlineMessage(timeConversion.message);
      }
    }
  }, [selectedUser]);

  return (
    <IonItem key={selectedUser.uid} button routerLink={`chats/${selectedUser.uid}`}>
      <IonAvatar slot="start">
        <IonImg src={selectedUser.image ? selectedUser.image : defaultImg} />
      </IonAvatar>
      <IonLabel>
        <h2>
          {`${selectedUser.firstName} ${selectedUser.lastName}`}{" "}
          {selectedUser.isOnline === "online" ? "🟢" : "🔴"}
        </h2>
        <p>
          <small>{selectedUser.email}</small>
        </p>
        {selectedUser.isOnline === "offline" && selectedUser.lastOnline && (
          <p>
            Last online: {lastOnlineTime} {lastOnlineMessage}
          </p>
        )}
      </IonLabel>
    </IonItem>
  );
}
