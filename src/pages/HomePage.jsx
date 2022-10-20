import {
  IonButton,
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonViewWillEnter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { auth } from "../util/firebase";
import { showTabBar } from "../util/helperMethods";
import { getUser, updateUserStatus } from "../util/user.server";
import { getPostsLimit, getPostsPaginated } from "../util/post.server";
import ProductListItem from "../components/ProductListItem";
import { Toast } from "@capacitor/toast";

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState();
  const [posts, setPosts] = useState([]);
  const [present, dismiss] = useIonLoading();
  const limiter = 12;

  useIonViewWillEnter(() => {
    // Show the tabbar again which is hidden on login/signup page
    showTabBar();
    fetchPost();
  });

  useEffect(() => {
    // Getting info about the user which is currently logged in
    async function getCurrentUser() {
      if (auth.currentUser) {
        const userResult = await getUser(auth?.currentUser?.uid);
        // If response is good we set state with the data
        if (userResult.status === 200 && userResult.data) {
          setCurrentUser(userResult.data);
          // Updating the status so we appear logged in (online)
          if (currentUser?.isOnline === "offline") {
            await updateUserStatus(true);
          }
        }
      }
    }
    getCurrentUser();
  }, [auth?.currentUser?.uid]);

  async function fetchPost() {
    const postResult = await getPostsLimit(limiter);
    if (postResult.status === 200 && postResult.posts) {
      setPosts(postResult.posts);
    }
  }

  async function fetchPostPaginated() {
    present({ message: "Loading..." });
    const lastPost = posts[posts.length - 1];
    const postResult = await getPostsPaginated(limiter, lastPost.id);
    if (postResult.status === 200 && postResult.posts) {
      if (postResult.posts.length === 0) {
        await Toast.show({
          text: "No more posts to show",
        });
      } else {
        setPosts([...posts, ...postResult.posts]);
      }
    }
    dismiss();
  }

  if (currentUser) {
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
          <IonList>
            <div className="ionCard-grid">
              {posts.map((post) => (
                <ProductListItem product={post} key={post.id} reload={fetchPost} currentUser={currentUser} />
              ))}
            </div>
          </IonList>
          <IonButton onClick={fetchPostPaginated}>Load more</IonButton>
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
