import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import ExploreContainer from "../components/ExploreContainer";
import { auth } from "../util/firebase";
import { showTabBar } from "../util/helperMethods";
import { getUser, updateUserStatus } from "../util/user.server";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState({});

  useIonViewWillEnter(() => {
    // Show the tabbar again which is hidden on login/signup page
    showTabBar();
    getCurrentUser();
  });

  // Getting info about the user which is currently logged in
  async function getCurrentUser() {
    if (auth.currentUser) {
      const userResult = await getUser(auth.currentUser.uid);
      // If response is good we set state with the data
      if (userResult.status === 200 && userResult.data) {
        setCurrentUser(userResult.data);
        // Updating the status so we appear logged in (online)
        if (!currentUser.isOnline) {
          await updateUserStatus();
        }
      }
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Hi, {currentUser.firstName}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Hi, {currentUser.firstName}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Home page" />
      </IonContent>
    </IonPage>
  );
}
