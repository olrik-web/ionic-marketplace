import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar } from "@ionic/react";
import { useContext } from "react";
import { Redirect } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import { AuthContext } from "../context/auth";
// import React from 'react';

/* export default function searchBar() {
  const { user } = IonSearchbar
};
*/

export default function searchBar();
 
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

export default function SearchPage() {
  
  const { user } = useContext(AuthContext);

  // Redirect to login if we're not logged in
  if (!user) {
    return <Redirect to="/login" />;
  }
  return (
    <IonPage>
      
      <ion-searchbar> </ion-searchbar>
      
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

// Search method
function search(query) {
  if (!query) { // revert back to the original array if no query
    this.usersArrayFiltered = [...this.usersArray];
  } else { // filter array by query
    this.usersArrayFiltered = this.usersArray.filter((user) => {
      return (user.name.includes(query) || user.email.includes(query) || user.phone.includes(query));
    })
  };
}

