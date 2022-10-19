import { IonButton, IonIcon, useIonActionSheet, useIonAlert, useIonModal } from "@ionic/react";
import { ellipsisHorizontalOutline } from "ionicons/icons";
import { Toast } from "@capacitor/toast";
import ProductUpdateModal from "./ProductUpdateModal";
import { deletePost } from "../util/post.server";

export default function PostActions({ post, reload }) {
  const [presentActionSheet] = useIonActionSheet();
  const [presentDeleteDialog] = useIonAlert();
  const [presentUpdateModal, dismissUpdateModal] = useIonModal(
    <ProductUpdateModal post={post} dismiss={handleDismissUpdateModal} reloadEvent={reload} />
  );

  function showActionSheet(event) {
    event.stopPropagation();
    event.preventDefault();
    presentActionSheet({
      buttons: [
        { text: "Edit", handler: presentUpdateModal },
        { text: "Delete", role: "descrutive", handler: showDeleteDialog },
        { text: "Cancel", role: "cancel" },
      ],
    });
  }

  // showDeleteDialog is a function that shows a dialog to confirm deletion
  function showDeleteDialog() {
    presentDeleteDialog({
      header: "Delete",
      message: "Are you sure you want to delete this product?",
      buttons: [{ text: "No" }, { text: "Yes", role: "destructive", handler: deletePostAction }],
    });
  }

  function handleDismissUpdateModal() {
    dismissUpdateModal();
  }

  async function deletePostAction() {
    const deleteResult = await deletePost(post.id);
    reload();

    await Toast.show({
      text: deleteResult.message,
      position: "center",
      duration: "short",
    });
  }

  return (
    <IonButton fill="clear" onClick={showActionSheet}>
      <IonIcon slot="icon-only" icon={ellipsisHorizontalOutline} />
    </IonButton>
  );
}
