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
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

export default function Profile() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

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
        setCurrentEmail(userResult.data.email);
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

    let shouldUpdatePassword = false;
    let shouldUpdateEmail = false;

    // If the user has entered a password, we need to update it
    if (newPassword !== "" && confirmPassword !== "") {
      if (newPassword.length < 6) {
        await Toast.show({
          text: "Password must be at least 6 characters long",
          duration: "long",
        });
        return;
      } else if (newPassword !== confirmPassword) {
        await Toast.show({
          text: "Passwords do not match",
          duration: "long",
        });
        return;
      } else {
        shouldUpdatePassword = true;
      }
    }

    // If first name, last name, or email are empty, we show a toast
    if (firstName === "" || lastName === "") {
      await Toast.show({
        text: "First name and last name are required",
      });
      return;
    }

    if (email === "") {
      await Toast.show({
        text: "Email is required",
      });
      return;
    } else if (email !== currentEmail) {
      shouldUpdateEmail = true;
    }

    // Show dialog asking user if they really want to sign out
    const confirm = await showConfirm("Update profile", "Are you sure?", "Update", "Cancel");
    if (confirm) {
      const user = {
        email,
        firstName,
        lastName,
        password: newPassword,
      };

      // If the user has changed their email or password, we need to reauthenticate them
      if (shouldUpdateEmail || shouldUpdatePassword) {
        try {
          // Create a credential with the current email and password
          const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
          // Reauthenticate the user
          await reauthenticateWithCredential(auth.currentUser, credential);
        } catch (error) {
          console.log(error);
          await Toast.show({
            text: "Incorrect password",
          });
          return;
        }
      }

      // Update the user
      const userResult = await updateUser(user, shouldUpdatePassword, shouldUpdateEmail);
      if (userResult.status === 200) {
        // If response is good, we show a toast
        await Toast.show({
          text: "Profile updated successfully",
          position: "center",
          duration: "short",
        });
        setNewPassword("");
        setConfirmPassword("");
        // And we redirect the user to the home page
        history.push("/home");
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
            <IonLabel position="stacked">Current password</IonLabel>
            <IonInput
              type="password"
              value={currentPassword}
              placeholder="Type your current password"
              onIonChange={(e) => setCurrentPassword(e.target.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">New password</IonLabel>
            <IonInput
              type="password"
              value={newPassword}
              placeholder="Type your password"
              onIonChange={(e) => setNewPassword(e.target.value)}
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
