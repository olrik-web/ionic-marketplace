import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useContext } from "react";
import { Redirect } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import { AuthContext } from "../context/auth";

export default function SearchPage() {
  const { user } = useContext(AuthContext);

  // Redirect to login if we're not logged in
  if (!user) {
    return <Redirect to="/login" />;
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Search</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Search page" />
      </IonContent>
    </IonPage>
  );
}
