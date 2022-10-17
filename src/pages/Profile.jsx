import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory } from "react-router";
import { getUser, signOutUser, updateUser } from "../util/user.server";
import { Dialog } from "@capacitor/dialog";
import { useState } from "react";
import { auth } from "../util/firebase";
import { Toast } from "@capacitor/toast";

export default function Profile() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useIonViewWillEnter(() => {
    getCurrentUser();
  });

  // Getting info about the user which is currently logged in
  async function getCurrentUser() {
    if (auth.currentUser) {
      const userResult = await getUser(auth.currentUser.uid);
      // If response is good we set state with the data
      if (userResult.status === 200 && userResult.data) {
        setEmail(userResult.data.email);
        setFirstName(userResult.data.firstName);
        setLastName(userResult.data.lastName);
      }
    }
  }

  async function handleSignOut() {
    // Show dialog asking user if they really want to sign out
    const confirm = await showConfirm("Sign Out", "Are you sure?", "Sign Out", "Cancel");
    // If they press ok, sign them out.
    if (confirm) {
      await signOutUser();
      history.push("/login");
    }
  }

  // Function that displays a confirm dialog
  async function showConfirm(title, message, okText, cancelText) {
    const { value } = await Dialog.confirm({
      title: title,
      message: message,
      okButtonTitle: okText,
      cancelButtonTitle: cancelText,
    });
    return value;
  }

  async function submitEvent(event) {
    event.preventDefault();

    let updatePassword = false;
    // If the password and confirm password fields are not empty, we check if they match
    if (password !== "" && confirmPassword !== "") {
      if (password !== confirmPassword) {
        await Toast.show({
          text: "Passwords do not match",
        });
        return;
      }
    }

    // If first name, last name, or email are empty, we show a toast
    if (firstName === "" || lastName === "") {
      await Toast.show({
        text: "First name and last name are required",
      });
      return;
    }

    if(email === "") {
      await Toast.show({
        text: "Email is required",
      });
      return;
    }

    // Show dialog asking user if they really want to sign out
    const confirm = await showConfirm("Update profile", "Are you sure?", "Update", "Cancel");
    if (confirm) {
      const user = {
        email,
        firstName,
        lastName,
        password,
      };

      const userResult = await updateUser(user);
      if (userResult.status === 200) {
        // If response is good, we show a toast
        await Toast.show({
          text: "Profile updated successfully",
          position: "center",
          duration: "short",
        });
      } else {
        // If response is bad, we show an error toast
        await Toast.show({
          text: "Error updating profile",
          position: "center",
          duration: "short",
        });
      }
    }
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
        <form onSubmit={submitEvent}>
          <IonItem>
            <IonLabel position="stacked">First name</IonLabel>
            <IonInput
              value={firstName}
              placeholder="Type your first name"
              onIonChange={(e) => setFirstName(e.target.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Last name</IonLabel>
            <IonInput
              value={lastName}
              placeholder="Type your last name"
              onIonChange={(e) => setLastName(e.target.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput value={email} placeholder="Type your email" onIonChange={(e) => setEmail(e.target.value)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              placeholder="Type your password"
              onIonChange={(e) => setPassword(e.target.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Confirm password</IonLabel>
            <IonInput
              type="password"
              value={confirmPassword}
              placeholder="Type your password again"
              onIonChange={(e) => setConfirmPassword(e.target.value)}
            />
          </IonItem>
          <IonButton type="submit" expand="block">
            Update profile
          </IonButton>
        </form>
        <IonButton type="button" expand="block" onClick={handleSignOut}>
          Sign out
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
