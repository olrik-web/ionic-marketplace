import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useHistory } from "react-router";
import SignUpForm from "../components/SignUpForm";
import { createUser } from "../util/user.server";
import { Toast } from "@capacitor/toast";

export default function SignUpPage() {
  let history = useHistory();

  async function handleSubmit(newUser) {
    // Creating the user with the form data as parameter
    const result = await createUser(newUser);

    // If we succesfully created a user go to login page otherwise display an error message.
    if (result.status === 200) {
      history.push("/login");
      await Toast.show({
        text: result.message,
        position: "center",
        duration: "long",
      });
    } else {
      await Toast.show({
        text: result.message,
        position: "center",
        duration: "long",
      });
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Sign Up</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SignUpForm handleSubmit={handleSubmit} />
      </IonContent>
    </IonPage>
  );
}
