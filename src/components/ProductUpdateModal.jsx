import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
} from "@ionic/react";
import { updatePost } from "../util/post.server";
import PostForm from "./ProductForm";

export default function ProductUpdateModal({ post, dismiss, reloadEvent }) {
  async function handleSubmit(updatedPost) {
    console.log(updatedPost);
    await updatePost(updatedPost);
    dismiss();
    reloadEvent();
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
