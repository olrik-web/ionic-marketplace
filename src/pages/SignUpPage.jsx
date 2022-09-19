import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Redirect, useHistory } from "react-router";
import SignUpForm from "../components/SignUpForm";
import { createUser } from "../util/user.server";

export default function SignUpPage() {
  let history = useHistory();
  const userId = localStorage.getItem("user");

  async function handleSubmit(newUser) {
    // present();

    // Creating the user with the form data as parameter
    const result = await createUser(newUser);
    console.log(result);

    // dismiss();

    if (result.status === 200) {
      // TODO: User was created. Show a toast, redirect to login or something
      history.push("/login");
      // await Toast.show({
      //   text: result.message,
      //   position: "center",
      //   duration: "long",
      // });
    } else {
      // TODO: User was NOT created. Show a toast or something
    }
  }

  // Redirect to home if we're already logged in
  if (userId) {
    return <Redirect to="/home" />;
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
