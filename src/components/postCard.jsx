import {
  IonItem,
  IonImg,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
} from "@ionic/react";
import "./PostCard.css";
import { bookmark } from "ionicons/icons";

export default function ProductListItem({ product }) {
  return (
    <IonCard
      className="ionCard"
      button
      key={product.uid}
      routerLink={`products/${product.uid}`}
    >
      <IonImg className="product-img" src={product.image} />
      <IonCardHeader>
        <IonCardTitle className="product-title">{product.title}</IonCardTitle>
        <IonCardSubtitle className="product-price">
          {product.price} kr
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent className="ionCard-content">
        <p className="product-size">Størrelse: {product.size} </p>
        <p className="product-location">Aarhus</p>
        <IonIcon icon={bookmark} slot="end" className="bookmark" />
      </IonCardContent>
    </IonCard>
  );
}
