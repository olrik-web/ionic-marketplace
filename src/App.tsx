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
import { home, searchOutline, person, chatbox } from "ionicons/icons";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/Profile";
import LoginPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import ChatsPage from "./pages/ChatsPage";
import UserChatPage from "./pages/UserChatPage";
import { AuthContext } from "./context/auth";

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
import { useContext } from "react";
import { signOutUser } from "./util/user.server";

setupIonicReact();

const App: React.FC = () => {
  const { user } = useContext(AuthContext);

  // We call the sign out user function when the user closes the application, so the user is set to offline
  window.addEventListener("beforeunload", () => {
    signOutUser();
  });

  return (
    <IonApp>
      <IonReactRouter>
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
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <Route exact path="/signup">
              <SignUpPage />
            </Route>
            {/* If the user is already logged in we redirect them to home page, otherwise go to login page */}
            <Route exact path="/">
              {user ? <Redirect to="/home" /> : <Redirect to="/login" />}
            </Route>
          </IonRouterOutlet>
          <IonTabBar id="app-tab-bar" slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
            <IonTabButton tab="chats" href="/chats">
              <IonIcon icon={chatbox} />
              <IonLabel>Chats</IonLabel>
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
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
