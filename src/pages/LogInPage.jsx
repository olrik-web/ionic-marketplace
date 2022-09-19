import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory } from "react-router";
import LoginForm from "../components/LogInForm";
import { hideTabBar } from "../util/tabbar";
import { validateUser } from "../util/user.server";

export default function LogInPage() {
  let history = useHistory();

  useIonViewWillEnter(() => {
    hideTabBar();
  });

  async function handleSubmit(user) {
    // present();

    const result = await validateUser(user);
    console.log(result);

    if (result.status === 200) {
      // TODO: Show a toast or something??
      history.push("/home");
      // await Toast.show({
      //   text: result.message,
      //   position: "center",
      //   duration: "long",
      // });
    } else {
      // TODO: Show a toast or something??
    }
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
