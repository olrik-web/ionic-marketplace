import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { Redirect, useHistory } from "react-router";
import LoginForm from "../components/LogInForm";
import { signIn } from "../util/user.server";
import { Toast } from "@capacitor/toast";
import { useContext } from "react";
import { AuthContext } from "../context/auth";
import { hideTabBar } from "../util/helperMethods";

export default function LogInPage() {
  let history = useHistory();
  const { user } = useContext(AuthContext);

  useIonViewWillEnter(() => {
    // Hide the tabbar on login page
    hideTabBar();
  });

  async function handleSubmit(user) {
    //TODO: Show loader
    // present();

    const result = await signIn(user);

    if (result.status === 200) {
      history.push("/home");
      await Toast.show({
        text: result.message,
        position: "center",
        duration: "short",
      });
    } else {
      await Toast.show({
        text: result.message,
        position: "center",
        duration: "short",
      });
    }
    //TODO: Hide loader
    // dismiss();
  }

  // Redirect to home if we're already logged in
  if (user) {
    return <Redirect to="/home" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Log In</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Log In</IonTitle>
          </IonToolbar>
        </IonHeader>

        <LoginForm handleSubmit={handleSubmit} />
      </IonContent>
    </IonPage>
  );
}
