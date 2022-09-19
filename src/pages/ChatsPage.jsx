import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Redirect } from "react-router";
import ListUser from "../components/ListUser";
import { getUsers } from "../util/user.server";

export default function ChatsPage() {
  const userId = localStorage.getItem("user");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers();
      if (data.status === 200) {
        setUsers(data.fields);
      }
    }
    fetchUsers();
  }, []);

  if (!userId) {
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
          {users.map((user) => (
            <ListUser key={user.id} user={user} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}
