import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router";
import ListUser from "../components/ListUser";
import { AuthContext } from "../context/auth";
import { auth, db } from "../util/firebase";

export default function ChatsPage() {
  const [users, setUsers] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // const data = await getUsers();
    // if (data.status === 200) {
    //   setUsers(data.fields);
    // }
    if (auth.currentUser) {
      const usersRef = collection(db, "users");
      // Quering the users collection without the current user.
      const q = query(usersRef, where("uid", "not-in", [auth.currentUser.uid]));
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

  if (!user) {
    return <Redirect to="/login" />;
  }
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
