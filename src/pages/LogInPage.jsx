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
import { hideTabBar } from "../util/tabbar";
import { validateUser } from "../util/user.server";
import { Toast } from "@capacitor/toast";

export default function LogInPage() {
  let history = useHistory();
  const userId = localStorage.getItem("user");

  useIonViewWillEnter(() => {
    hideTabBar();
  });

  async function handleSubmit(user) {
    //TODO: Show loader
    // present();

    const result = await validateUser(user);
    console.log(result);

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
        duration: "long",
      });
    }
    //TODO: Hide loader
    // dismiss();
  }

  // Redirect to home if we're already logged in
  if (userId) {
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
