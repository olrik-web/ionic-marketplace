import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import { useParams } from "react-router";
import ProductListItem from "../components/ProductListItem";
import { auth } from "../util/firebase";
import { getPost } from "../util/post.server";
import { getUser } from "../util/user.server";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [currentUser, setCurrentUser] = useState({});

  useIonViewWillEnter(() => {
    // fetch product details
    fetchPost();
    getCurrentUser();
  }, []);

  async function fetchPost() {
    const response = await getPost(id);
    if (response.status === 200) {
      setPost(response.post);
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Home" defaultHref="/home"></IonBackButton>
          </IonButtons>
          <IonTitle>{post.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{post.title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ProductListItem product={post} key={id} reload={fetchPost} currentUser={currentUser} detailView={true} />
      </IonContent>
    </IonPage>
  );
}
