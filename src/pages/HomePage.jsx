import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { Redirect } from "react-router";
import ExploreContainer from "../components/ExploreContainer";

export default function HomePage() {
  const userId = localStorage.getItem("user");

  useIonViewWillEnter(() => {
    showTabBar();
  });

  function showTabBar() {
    const tabBar = document.getElementById("app-tab-bar");
    if (tabBar !== null) {
      tabBar.style.display = "flex";
    }
  }

  if (!userId) {
    return <Redirect to="/login" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Home page" />
      </IonContent>
    </IonPage>
  );
}
