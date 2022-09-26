import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useContext } from "react";
import { Redirect } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import { AuthContext } from "../context/auth";
import React from 'react';
import { IonSearchbar } from '@ionic/react';

export default function searchBar() {

}:

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

  function searchBar() {
    return (
      <>
        <IonSearchbar></IonSearchbar>
        <IonSearchbar placeholder="Custom Placeholder"></IonSearchbar>
        <IonSearchbar disabled={true} placeholder="Disabled"></IonSearchbar>
        <IonSearchbar value="Value"></IonSearchbar>
        <IonSearchbar animated={true} placeholder="Animated"></IonSearchbar>
      </>
    );
  }
}
