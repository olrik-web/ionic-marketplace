import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { home, searchOutline, person, chatbox, add } from "ionicons/icons";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/Profile";
import LoginPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatsPage from "./pages/ChatsPage";
import UserChatPage from "./pages/UserChatPage";
import AddPage from "./pages/AddPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";

import { App } from "@capacitor/app";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { signOutUser, updateUserStatus } from "./util/user.server";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/app.css";

setupIonicReact();

function PrivateRoutes() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/home">
          <HomePage />
        </Route>
        <Route exact path="/search">
          <SearchPage />
        </Route>
        <Route exact path="/chats">
          <ChatsPage />
        </Route>
        <Route path="/chats/:id">
          <UserChatPage />
        </Route>
        <Route exact path="/profile">
          <ProfilePage />
        </Route>
        <Route exact path="/add">
          <AddPage />
        </Route>
        <Route exact path="/products/:id">
          <ProductDetailsPage />
        </Route>
        <Redirect exact from="/" to="/home" />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={home} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="chats" href="/chats">
          <IonIcon icon={chatbox} />
          <IonLabel>Chats</IonLabel>
        </IonTabButton>
        <IonTabButton tab="add" href="/add">
          <IonIcon icon={add} />
          <IonLabel>Add</IonLabel>
        </IonTabButton>
        <IonTabButton tab="search" href="/search">
          <IonIcon icon={searchOutline} />
          <IonLabel>Search</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/profile">
          <IonIcon icon={person} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

function PublicRoutes() {
  return (
    <IonRouterOutlet>
      <Route exact path="/login" component={LoginPage} />
      <Route exact path="/signup" component={SignUpPage} />
    </IonRouterOutlet>
  );
}

const IonicApp: React.FC = () => {
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(localStorage.getItem("userIsAuthenticated"));
  const auth = getAuth();

  if (auth?.currentUser?.uid) {
    // We call the sign out user function when the user closes the application, so the user is set to offline
    window.addEventListener("beforeunload", () => {
      signOutUser();
    });

    App.addListener("appStateChange", ({ isActive }) => {
      if (!isActive) {
        updateUserStatus("offline");
      } else {
        updateUserStatus("online");
      }
    });
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated
        setUserIsAuthenticated("true");
        localStorage.setItem("userIsAuthenticated", "true");
      } else {
        // User is signed out
        setUserIsAuthenticated("false");
        localStorage.removeItem("userIsAuthenticated");
      }
    });
  }, [auth]);

  return (
    <IonApp>
      <IonReactRouter>
        {userIsAuthenticated === "true" ? <PrivateRoutes /> : <PublicRoutes />}
        <Route>{userIsAuthenticated === "true" ? <Redirect to="/home" /> : <Redirect to="/login" />}</Route>
      </IonReactRouter>
    </IonApp>
  );
};

export default IonicApp;
