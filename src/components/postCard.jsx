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
import PostActions from "./PostAction";

export default function ProductListItem({ product, reload }) {
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
      <PostActions post={product} reload={reload} />
      <IonCardContent className="ionCard-content">
        <p className="product-size">Størrelse: {product.size} </p>
        <p className="product-location">Aarhus</p>
        <IonIcon icon={bookmark} slot="end" className="bookmark" />
      </IonCardContent>
    </IonCard>
  );
} 
