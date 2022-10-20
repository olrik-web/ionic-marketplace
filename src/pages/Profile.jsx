import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonViewWillEnter,
} from "@ionic/react";
import { useHistory } from "react-router";
import { getUser, signOutUser, updateUser } from "../util/user.server";
import { Dialog } from "@capacitor/dialog";
import { useState } from "react";
import { auth } from "../util/firebase";
import { Toast } from "@capacitor/toast";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { getPost, getPostsCurrentUser } from "../util/post.server";
import ProductListItem from "../components/ProductListItem";
import { getLocationCity, updateLocation } from "../util/location.server";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import { getFavoritedPosts } from "../util/favorite.server";

export default function Profile() {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [posts, setPosts] = useState([]);
  const [favoritedPosts, setFavoritedPosts] = useState([]);
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [present, dismiss] = useIonLoading();

  useIonViewWillEnter(() => {
    getCurrentUser();
    getPosts();
    getBookmarkedPosts();
    // Getting the location of the device.
    setCurrentPosition();
  });

  // Get bookmarked posts from the database.
  async function getBookmarkedPosts() {
    let tempPosts = [];
    if (auth.currentUser) {
      const postsResult = await getFavoritedPosts();
      // If response is good we set state with the data
      if (postsResult.status === 200 && postsResult.data) {
        postsResult.data.forEach((favorite) =>
          getPost(favorite.postId).then((result) => {
            if (result.status === 200 && result.post) {
              if (result.post != null) {
                tempPosts.push(result.post);
                setFavoritedPosts(tempPosts);
              }
            }
          })
        );
      } else {
        // Show error message if something went wrong.
        await Toast.show({
          text: postsResult.message,
          position: "center",
          duration: "short",
        });
      }
    }
  }

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
        setCity(userResult.data.city);
        setCurrentUser(userResult.data);
      }
    }
  }

  // Getting the user's posts from the database
  async function getPosts() {
    if (auth.currentUser) {
      const postsResult = await getPostsCurrentUser(auth.currentUser.uid);
      // If response is good we set state with the data
      if (postsResult.status === 200 && postsResult.posts) {
        setPosts(postsResult.posts);
      } else {
        // Show error message if something went wrong.
        await Toast.show({
          text: postsResult.message,
          position: "center",
          duration: "short",
        });
      }
    }
  }

  async function handleSignOut() {
    // Show dialog asking user if they really want to sign out
    const confirm = await showConfirm("Sign Out", "Are you sure?", "Sign Out", "Cancel");
    // If they press ok, sign them out.
    if (confirm) {
      present({ message: "Loading..." });
      await signOutUser();
      history.push("/login");
      dismiss();
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
          await Toast.show({
            text: "Incorrect password",
          });
          return;
        }
      }
      present({ message: "Loading..." });
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
      dismiss();
    }
  }

  async function setCurrentPosition() {
    // If the device is ios or android we ask for permission to get the location.
    if (Capacitor.isNativePlatform()) {
      const hasPermission = await Geolocation.checkPermissions();
      if (
        hasPermission.coarseLocation.toLowerCase() === "granted" ||
        hasPermission.location.toLowerCase() === "granted"
      ) {
        // If they have, get the current position
        const locationData = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        setLatitude(locationData.coords.latitude);
        setLongitude(locationData.coords.longitude);
      } else {
        // If they haven't, ask for permission
        const permission = await Geolocation.requestPermissions();
        if (permission.coarseLocation.toLowerCase() === "granted" || permission.location.toLowerCase() === "granted") {
          // If they grant permission, get the current position
          const locationData = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
          setLatitude(locationData.coords.latitude);
          setLongitude(locationData.coords.longitude);
        }
      }
    } else {
      // If the device is a web browser, we get the location
      const locationData = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      setLatitude(locationData.coords.latitude);
      setLongitude(locationData.coords.longitude);
    }
  }

  async function changeLocation() {
    present({ message: "Loading..." });
    if (latitude && longitude && latitude !== 0 && longitude !== 0) {
      const locationData = await getLocationCity(latitude, longitude);
      if (locationData.status === 200) {
        // Update location in database
        const locationResult = await updateLocation(locationData.locality, latitude, longitude);
        if (locationResult.status === 200) {
          setCity(locationData.locality);
          await Toast.show({
            text: "Location changed to " + locationData.locality,
            position: "center",
            duration: "short",
          });
        } else {
          await Toast.show({
            text: locationResult.message,
            position: "center",
            duration: "short",
          });
        }
      } else {
        await Toast.show({
          text: locationData.message,
          position: "center",
          duration: "short",
        });
      }
    } else {
      await Toast.show({
        text: "Please enable location services",
        position: "center",
        duration: "short",
      });
    }
    dismiss();
  }
  if (currentUser) {
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
              <IonButton type="button" onClick={changeLocation} fill="outline" slot="end">
                Update location
              </IonButton>
              <IonLabel position="stacked">City</IonLabel>
              <IonInput value={city} readonly />
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
                placeholder="Type your new password"
                onIonChange={(e) => setNewPassword(e.target.value)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Confirm new password</IonLabel>
              <IonInput
                type="password"
                value={confirmPassword}
                placeholder="Type your new password again"
                onIonChange={(e) => setConfirmPassword(e.target.value)}
              />
            </IonItem>
            <IonButton type="submit" expand="block">
              Update profile
            </IonButton>
          </form>
          {posts.length > 0 && (
            <>
              <IonItem position="stacked">
                <IonLabel>
                  <h1>Your posts</h1>
                </IonLabel>
              </IonItem>
              <IonList>
                <div className="ionCard-grid">
                  {posts.map((post) => (
                    <ProductListItem key={post.id} product={post} profileView={true} reload={getPosts} />
                  ))}
                </div>
              </IonList>
            </>
          )}
          {favoritedPosts.length > 0 && (
            <>
              <IonItem position="stacked">
                <IonLabel>
                  <h1>Your bookmarked items</h1>
                </IonLabel>
              </IonItem>
              <IonList>
                <div className="ionCard-grid">
                  {favoritedPosts.map((post) => (
                    <ProductListItem
                      key={post.id}
                      product={post}
                      currentUser={currentUser}
                      getPosts={getPosts}
                      getBookmarkedPosts={getBookmarkedPosts}
                    />
                  ))}
                </div>
              </IonList>
            </>
          )}
          <IonButton type="button" expand="block" onClick={handleSignOut}>
            Sign out
          </IonButton>
        </IonContent>
      </IonPage>
    );
  } else {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Loading...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Loading...</IonTitle>
            </IonToolbar>
          </IonHeader>
        </IonContent>
      </IonPage>
    );
  }
}
