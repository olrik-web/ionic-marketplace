import {
  IonItem,
  IonImg,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonButton,
  useIonActionSheet,
  useIonAlert,
  useIonModal,
} from "@ionic/react";
import "./PostCard.css";
import { bookmark } from "ionicons/icons";
import { ellipsisHorizontalOutline } from "ionicons/icons";
import { deletePost } from "../util/post.server";
import { Toast } from "@capacitor/toast";
import ProductUpdateModal from "./ProductUpdateModal";

export default function ProductListItem({ product, reload }) {
  const [presentActionSheet] = useIonActionSheet();
  const [presentDeleteDialog] = useIonAlert();
  const [presentUpdateModal, dismissUpdateModal] = useIonModal(
    <ProductUpdateModal
      post={product}
      dismiss={handleDismissUpdateModal}
      reloadEvent={reload}
    />
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
      buttons: [
        { text: "No" },
        { text: "Yes", role: "destructive", handler: deletePostAction },
      ],
    });
  }

  function handleDismissUpdateModal() {
    dismissUpdateModal();
  }

  async function deletePostAction() {
    await deletePost(product.id);

    reload();

    await Toast.show({
      text: "Post deleted successfully!",
      position: "center",
    });
  }

  return (
    <IonCard
      className="ionCard"
      button
      key={product.id}
      routerLink={`products/${product.id}`}
    >
      <IonImg className="product-img" src={product.image} />
      <IonCardHeader>
        <IonCardSubtitle className="product-price">
          {product.price} kr
        </IonCardSubtitle>
        <IonCardTitle className="product-title">{product.title}</IonCardTitle>
      </IonCardHeader>
      <IonButton fill="clear" onClick={showActionSheet}>
        <IonIcon slot="icon-only" icon={ellipsisHorizontalOutline} />
      </IonButton>
      <IonCardContent className="ionCard-content">
        <p className="product-size">Størrelse: {product.size} </p>
        <p className="product-location">Aarhus</p>
        <IonIcon icon={bookmark} slot="end" className="bookmark" />
      </IonCardContent>
    </IonCard>
  );
}
