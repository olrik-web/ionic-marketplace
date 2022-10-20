import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, useIonLoading } from "@ionic/react";
import { updatePost } from "../util/post.server";
import PostForm from "./ProductForm";

export default function ProductUpdateModal({ post, dismiss, reload }) {
  const [present, dismissLoader] = useIonLoading();

  async function handleSubmit(updatedPost) {
    present({ message: "Loading..." });
    await updatePost(updatedPost);
    dismiss();
    reload();
    dismissLoader();
  }

  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="secondary">
            <IonButton onClick={() => dismiss()}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Edit Post</IonTitle>
        </IonToolbar>
      </IonHeader>
      <PostForm post={post} handleSubmit={handleSubmit} />
    </IonContent>
  );
}
