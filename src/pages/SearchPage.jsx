import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import ProductListItem from "../components/ProductListItem";
import { auth } from "../util/firebase";
import { getPosts } from "../util/post.server";
import { getUser } from "../util/user.server";

export default function SearchPage() {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useIonViewWillEnter(() => {
    fetchPost();
    getCurrentUser();
  });

  async function fetchPost() {
    const postResult = await getPosts();
    if (postResult.status === 200 && postResult.posts) {
      setPosts(postResult.posts);
    }
  }

  // Getting info about the user which is currently logged in
  async function getCurrentUser() {
    if (auth.currentUser) {
      const userResult = await getUser(auth.currentUser.uid);
      // If response is good we set state with the data
      if (userResult.status === 200 && userResult.data) {
        setCurrentUser(userResult.data);
      }
    }
  }

  // Filter array of objects
  const filteredItems = posts.filter(
    (item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Search</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar
          autocorrect="on"
          spellcheck={true}
          showClearButton="focus"
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value)}
        ></IonSearchbar>
        <div className="ionCard-grid">
          {filteredItems.map((post) => (
            <ProductListItem product={post} key={post.id} reload={fetchPost} currentUser={currentUser} />
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
}
