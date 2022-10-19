import {
  IonImg,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import "./PostCard.css";
import Favorite from "./Favorite";
import PostActions from "./PostAction";
import DistanceBetween from "./DistanceBetween";
import { getUser } from "../util/user.server";
import { useEffect, useState } from "react";

export default function ProductListItem({ product, reload, currentUser, detailView, profileView }) {
  const [seller, setSeller] = useState({});

  useEffect(() => {
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

    getSeller();
  }, [product.createdBy]);

  return (
    <IonCard className="ionCard" routerLink={!detailView ? `products/${product.id}` : {}}>
      <IonImg className={detailView ? "product-img-detail" : "product-img"} src={product.image} />
      <IonCardHeader>
        <IonItem color="none" lines="none">
          <IonCardSubtitle color={"primary"}>
            <h1>{product.price} kr</h1>
          </IonCardSubtitle>
          <PostActions post={product} reload={reload} />
        </IonItem>
        <IonItem color="none" lines="none">
          <IonCardTitle>{product.title}</IonCardTitle>
        </IonItem>
      </IonCardHeader>

      <IonCardContent>
        <IonList>
          {product?.size && (
            <IonItem lines="none">
              <IonLabel color={"medium"}>Size</IonLabel>
              <p className="product-size">{product?.size} </p>
            </IonItem>
          )}

          {product?.category && (
            <IonItem lines="none">
              <IonLabel color={"medium"}>Category</IonLabel>
              {product?.category}
            </IonItem>
          )}

          {seller.location && seller.city && !profileView && (
            <IonItem lines="none">
              <IonLabel color={"medium"}>Location</IonLabel>
              <p className="product-location">
                {seller.city}, <DistanceBetween seller={seller} buyer={currentUser} /> km away
              </p>
            </IonItem>
          )}
          <IonItem lines="none">
            <Favorite product={product} />
          </IonItem>
        </IonList>
      </IonCardContent>
    </IonCard>
  );
}
