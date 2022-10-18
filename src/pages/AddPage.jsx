import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import ProductForm from "../components/ProductForm";
import { Toast } from "@capacitor/toast";
import { createPost } from "../util/post.server";
import { useHistory } from "react-router";

export default function AddPage() {
  const history = useHistory();
  async function handleSubmit(newPost) {
    const postResult = await createPost(newPost);

    await Toast.show({
      text: postResult.message,
      position: "center",
      duration: "long",
    });
    // redirect to home page after successful post.
    if (postResult?.status === 200) {
      history.push("/home");
    }
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add post</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Add post</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ProductForm handleSubmit={handleSubmit} />
      </IonContent>
    </IonPage>
  );
}
