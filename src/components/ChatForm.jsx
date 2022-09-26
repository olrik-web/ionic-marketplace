import { IonItem, IonInput, IonButton, IonIcon, IonImg, IonList } from "@ionic/react";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { camera, send, closeCircleSharp as closeCircle } from "ionicons/icons";
import { Camera, CameraResultType } from "@capacitor/camera";


export default function ChatForm({ handleSubmit, user1, user2 }) {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");

  function submitEvent(event) {
    event.preventDefault();

    const formData = {
      text: message,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      image: image
    };
    handleSubmit(formData);
    setMessage("");
  }

    async function takePicture() {
      const image = await Camera.getPhoto({
        quality: 80,
        width: 500,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
      });

      var imageUrl = image.dataUrl;

      // Can be set to the src of an image now
      setImage(imageUrl);
    }

  return (
    <form onSubmit={submitEvent} className="chatForm">
      {image && (
        <IonList>
          <IonButton onClick={() => setImage("")} color="primary" size="default" fill="clear">
            <IonIcon icon={closeCircle} />
          </IonButton>
          <IonImg className="chatMessageImageSmall" src={image} />
        </IonList>
      )}
      <IonItem lines="none">
        <IonButton onClick={takePicture} color="primary" fill="clear" size="default">
          <IonIcon icon={camera} />
        </IonButton>
        <IonInput value={message} placeholder="Type a message..." onIonChange={(e) => setMessage(e.target.value)} />
        <IonButton size="default" type="submit" fill="clear">
          <IonIcon icon={send} />
        </IonButton>
      </IonItem>
    </form>
  );
}
