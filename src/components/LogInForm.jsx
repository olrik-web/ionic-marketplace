import { IonItem, IonLabel, IonInput, IonButton } from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

export default function LogInForm({ handleSubmit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let history = useHistory();

  function submitEvent(event) {
    event.preventDefault();

    const formData = {
      email: email,
      password: password,
    };
    handleSubmit(formData);
  }

  function goToSignUp() {
    history.push("/signup");
  }

  return (
    <form onSubmit={submitEvent}>
      <IonItem>
        <IonLabel position="stacked">Email</IonLabel>
        <IonInput
          value={email}
          placeholder="example@email.com"
          onIonChange={(e) => setEmail(e.target.value)}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Password</IonLabel>
        <IonInput
          value={password}
          placeholder="Type your password"
          onIonChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </IonItem>
      <div className="btnsLogin">
        <IonButton type="submit">Log in</IonButton>
        <IonButton type="button" fill="outline" onClick={goToSignUp}>
          Sign up
        </IonButton>
      </div>
    </form>
  );
}
