import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useHistory } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import { signOutUser } from "../util/user.server";
import { Dialog } from "@capacitor/dialog";

export default function Profile() {
  const history = useHistory();

  async function handleSignOut() {
    // Show dialog asking user if they really want to sign out
    const confirm = await showConfirm();
    // If they press ok, sign them out.
    if (confirm) {
      await signOutUser();
      history.push("/login");
    }
  }

  // Function that displays a confirm dialog
  async function showConfirm() {
    const { value } = await Dialog.confirm({
      title: "Confirm",
      message: `Are you sure you'd like to sign out?`,
      okButtonTitle: "Yes, sign out",
      cancelButtonTitle: "No, stay signed in",
    });
    return value;
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
