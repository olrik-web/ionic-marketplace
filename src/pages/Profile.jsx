import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Redirect, useHistory } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import { signOut } from "../util/user.server";

export default function Profile() {
  const history = useHistory();
  function handleSignOut() {
    // TODO: Show "are you sure you want to sign out?" modal.
    signOut();
    history.push("/login", );
  }
  const userId = localStorage.getItem("user");
  if (!userId) {
    return <Redirect to="/login" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Profile page" />
        <IonButton type="button" expand="block" onClick={handleSignOut}>
          Sign out
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
