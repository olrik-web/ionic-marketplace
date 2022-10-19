import {
  IonImg,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  useIonViewWillEnter,
} from "@ionic/react";
import "./PostCard.css";
import { bookmark } from "ionicons/icons";
import PostActions from "./PostAction";
import DistanceBetween from "./DistanceBetween";
import { getUser } from "../util/user.server";
import { useState } from "react";

export default function ProductListItem({ product, reload, currentUser }) {
  const [seller, setSeller] = useState({});

  useIonViewWillEnter(() => {
    // Show the tabbar again which is hidden on login/signup page
    getSeller();
  });

  // Getting info about the user which is currently logged in
  async function getSeller() {
    if (product.createdBy) {
      const userResult = await getUser(product.createdBy);
      // If response is good we set state with the data
      if (userResult.status === 200 && userResult.data) {
        setSeller(userResult.data);
      }
    }
  }

  return (
    <IonCard className="ionCard" button key={product.id} routerLink={`products/${product.id}`}>
      <IonImg className="product-img" src={product.image} />
      <IonCardHeader>
        <IonCardSubtitle className="product-price">{product.price} kr</IonCardSubtitle>
        <IonCardTitle className="product-title">{product.title}</IonCardTitle>
      </IonCardHeader>
      <PostActions post={product} reload={reload} />
      <IonCardContent className="ionCard-content">
        <p className="product-size">Størrelse: {product.size} </p>
        {seller.location && seller.city && (
          <p className="product-location">
            {seller.city}, <DistanceBetween seller={seller} buyer={currentUser} /> km away
          </p>
        )}
        <IonIcon icon={bookmark} slot="end" className="bookmark" />
      </IonCardContent>
    </IonCard>
  );
}
