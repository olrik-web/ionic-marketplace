import {
  IonAvatar,
  IonCard,
  IonImg,
  IonItem,
  IonLabel,
  IonTextarea,
  useIonActionSheet,
  useIonAlert,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { auth } from "../util/firebase";
import { timeConverter } from "../util/helperMethods";

export default function ChatMessage({ message, otherUser, handleDelete }) {
  const defaultImg =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";
  const currentUser = auth.currentUser.uid;
  const [messageTimeText, setMessageTimeText] = useState();
  const [presentActionSheet] = useIonActionSheet();
  const [presentDeleteDialog] = useIonAlert();

  useEffect(() => {
    const timeConversion = timeConverter(message.createdAt, true);
    if (timeConversion.message === "A few seconds ago...") {
      setMessageTimeText("");
    } else {
      setMessageTimeText(timeConversion.time);
    }
  }, [message]);

  function showActionSheet(event) {
    event.preventDefault();
    presentActionSheet({
      buttons: [
        { text: "Delete", role: "destructive", handler: showDeleteDialog },
        { text: "Cancel", role: "cancel" },
      ],
    });
  }

  function showDeleteDialog() {
    presentDeleteDialog({
      header: "Delete Post",
      message: "Do you want to delete this post?",
      buttons: [
        { text: "No" },
        { text: "Yes", role: "destructive", handler: handleDelete },
      ],
    });
  }

  return (
    <>
      {message.from === currentUser ? (
        <>
          <IonItem lines="none">
            <IonAvatar slot="end">
              <IonImg src={otherUser.image ? otherUser.image : defaultImg} />
            </IonAvatar>
            <IonLabel className="chatMessageAlignRight alignRight">
              <p>
                <small>{messageTimeText}</small>
              </p>
            </IonLabel>
          </IonItem>
          <IonItem lines="none" onClick={showActionSheet}>
            <IonCard slot="end" color="primary" className="chatMessageCard">
              <IonTextarea
                value={message.text}
                autoGrow={true}
                readonly={true}
              />
              {message.image && (
                <IonImg
                  className="chatMessageImage"
                  src={message.image}
                  alt={message.text}
                />
              )}
            </IonCard>
          </IonItem>
        </>
      ) : (
        <>
          <IonItem lines="none">
            <IonAvatar className="chatIonAvatarEnd" slot="start">
              <IonImg src={otherUser.image ? otherUser.image : defaultImg} />
            </IonAvatar>
            <IonLabel>
              <p>
                <small>{messageTimeText}</small>
              </p>
            </IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonCard color="light" className="chatMessageCard">
              <IonTextarea
                value={message.text}
                autoGrow={true}
                readonly={true}
              />
              {message.image && (
                <IonImg
                  className="chatMessageImage"
                  src={message.image}
                  alt={message.text}
                />
              )}
            </IonCard>
          </IonItem>
        </>
      )}
    </>
  );
}
