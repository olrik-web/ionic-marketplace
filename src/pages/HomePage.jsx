import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import ExploreContainer from "../components/ExploreContainer";
import { auth } from "../util/firebase";
import { showTabBar } from "../util/helperMethods";
import { getUser, updateUserStatus } from "../util/user.server";
import { getPosts } from "../util/post.server";
import ProductListItem from "../components/PostCard";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState({});
  const [posts, setPosts] = useState([]);
  console.log(currentUser);

  useEffect(() => {
    async function fetchPost() {
      const postResult = await getPosts();
      if (postResult.status === 200 && postResult.posts) {
        setPosts(postResult.posts);
      }
    }
    fetchPost();
  }, []);

  useIonViewWillEnter(() => {
    // Show the tabbar again which is hidden on login/signup page
    showTabBar();
    getCurrentUser();
  });

  // Getting info about the user which is currently logged in
  async function getCurrentUser() {
    if (auth.currentUser) {
      const userResult = await getUser(auth.currentUser.uid);
      // If response is good we set state with the data
      if (userResult.status === 200 && userResult.data) {
        setCurrentUser(userResult.data);
        // Updating the status so we appear logged in (online)
        if (currentUser.isOnline === "offline") {
          await updateUserStatus(true);
        }
      }
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Hi, {currentUser.firstName}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Hi, {currentUser.firstName}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Home page" />
        <IonList>
          <div className="ionCard-item">
            {posts.map((post) => (
              <ProductListItem product={post} key={post.uid} />
            ))}
          </div>
        </IonList>
      </IonContent>
    </IonPage>
  );
}
