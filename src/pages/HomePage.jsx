import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import { AuthContext } from "../context/auth";
import { db } from "../util/firebase";
import { showTabBar } from "../util/helperMethods";
import { updateUserStatus } from "../util/user.server";

export default function HomePage() {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    async function getCurrentUser() {
      if (user) {
        // console.log("User is not null");
        // window.addEventListener("load", async () => {
        //         console.log("Calling function");

        //   await signInUser();
        // });

        // TODO: Move into util/user.server.js file
        const docRef = doc(db, "users", user.uid);
        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // console.log(docSnap.data());
            setCurrentUser(docSnap.data());
            if (!currentUser.isOnline) {
              await updateUserStatus();
            }
          } else {
            console.log("Document does not exist");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    getCurrentUser();
  }, [user, currentUser.isOnline]);

  useIonViewWillEnter(() => {
    showTabBar();
  });

  console.log(currentUser);

  if (!user) {
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
