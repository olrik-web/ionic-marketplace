import { IonItem, IonInput, IonButton } from "@ionic/react";
import { useState } from "react";

export default function ChatForm({ handleSubmit, user1, user2 }) {
  const [message, setMessage] = useState("");

  function submitEvent(event) {
    event.preventDefault();

    const formData = {
      text: message,
      user1: user1,
      user2: user2,
      createdAt: Date.now,
    };
    handleSubmit(formData);
    setMessage("");
  }

  return (
    <form onSubmit={submitEvent}>
      <IonItem>
        <IonInput
          value={message}
          placeholder="Type a message..."
          onIonChange={(e) => setMessage(e.target.value)}
        />
      </IonItem>
      <div className="btnsLogin">
        <IonButton type="submit">Send</IonButton>
      </div>
    </form>
  );
}
