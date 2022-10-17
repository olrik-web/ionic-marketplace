import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ProductForm from "../components/ProductForm";
import { Toast } from "@capacitor/toast";
import { createPost } from "../util/post.server";

const AddPage = () => {
  async function handleSubmit(newPost) {
    // TODO: Create a new post

    const postResult = await createPost(newPost);

    await Toast.show({
      text: postResult.message,
      position: "center",
      duration: "long",
    });
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
};

export default AddPage;
