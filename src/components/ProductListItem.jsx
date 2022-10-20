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
import { auth } from "../util/firebase";

export default function ProductListItem({ product, reload, detailView, profileView }) {
  const [seller, setSeller] = useState();
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    // Getting info about the user which is currently logged in
    async function getCurrentUser() {
      if (auth.currentUser) {
        const userResult = await getUser(auth?.currentUser?.uid);
        // If response is good we set state with the data
        if (userResult.status === 200 && userResult.data) {
          setCurrentUser(userResult.data);
        }
      }
    }
    getCurrentUser();
  }, [auth?.currentUser?.uid]);

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

  if (seller && currentUser) {
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

            {seller.location != null &&
              seller.location !== 0 &&
              currentUser.location != null &&
              currentUser.location !== 0 &&
              seller.city &&
              !profileView && (
                <IonItem lines="none">
                  <IonLabel color={"medium"}>Location</IonLabel>
                  <p className="product-location">
                    {seller.city}, <DistanceBetween seller={seller.location} buyer={currentUser.location} /> km away
                  </p>
                </IonItem>
              )}
            {detailView && (
              <IonItem lines="none">
                <IonLabel position="stacked" color={"medium"}>Description</IonLabel>
                <p className="product-description">{product.description}</p>
              </IonItem>
            )}
            {product.createdBy !== auth.currentUser.uid && (
              <IonItem lines="none">
                <Favorite product={product} />
              </IonItem>
            )}
          </IonList>
        </IonCardContent>
      </IonCard>
    );
  }
}
