import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import ListUser from "../components/ListUser";
import { auth, db } from "../util/firebase";

export default function ChatsPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      // We get all users (except our self) and listen for changes e.g. their offline/online status
      const usersRef = collection(db, "users");
      // Quering the users collection without the current user.
      const q = query(usersRef, where("uid", "not-in", [auth.currentUser.uid]));
      // TODO: Test if we need the unsub const
      // Attaching a listener so user status changes are displayed immediately
      const unsub = onSnapshot(q, (querySnapshot) => {
        // Pushing each user from the collection to a temporary array
        let tempUsers = [];
        querySnapshot.forEach((doc) => {
          tempUsers.push(doc.data());
        });
        // Setting the users with out temporary array
        setUsers(tempUsers);
      });
      return () => unsub;
    }
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chats</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Chats</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          {users.map((selectedUser) => (
            <ListUser key={selectedUser.uid} selectedUser={selectedUser} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
