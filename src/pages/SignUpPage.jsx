import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { Redirect, useHistory } from "react-router";
import SignUpForm from "../components/SignUpForm";
import { createUser } from "../util/user.server";
import { Toast } from "@capacitor/toast";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../util/firebase";
import {setDoc, doc, Timestamp} from "firebase/firestore";
import { AuthContext } from "../context/auth";
import { useContext } from "react";

export default function SignUpPage() {
  let history = useHistory();
    const { user } = useContext(AuthContext);


  async function handleSubmit(newUser) {
    //TODO: Show loader
    // present();

    // Creating the user with the form data as parameter
    

    const result = await createUser(newUser);
    // console.log(result);

    if (result.status === 200) {
      history.push("/login");
      await Toast.show({
        text: result.message,
        position: "center",
        duration: "long",
      });
    } else {
      await Toast.show({
        text: result.message,
        position: "center",
        duration: "long",
      });
    }
    //TODO: Hide loader
    // dismiss();
  }

  // Redirect to home if we're already logged in
  if (user) {
    return <Redirect to="/home" />;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sign Up</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Sign Up</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SignUpForm handleSubmit={handleSubmit} />
      </IonContent>
    </IonPage>
  );
}
