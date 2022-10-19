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
import { bookmark, bookmarkOutline } from "ionicons/icons";
import PostActions from "./PostAction";
import React from 'react';
import { IonButton } from '@ionic/react';
import { createFavorite, deleteFavorite } from "../util/favorite.server";
import { useState } from 'react';
import { resultingClientExists } from "workbox-core/_private";


export default function Favorite({product}) {
  const [favorite, setFavorite] = useState();
  useIonViewWillEnter ( () => {
    getFavorite();
  });

  async function getFavorite() {
   const result = await getFavorite(product.id);
   console.log(result);
  }
  
  async function handleFavorite(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!favorite) {
      const result = await createFavorite(product.id);
      setFavorite(true);
    } else {
      const result = await deleteFavorite(product.id);
      setFavorite(false);
    }
    
  };

  return (

  <IonButton onClick={handleFavorite}>
      <IonIcon icon={favorite? bookmark : bookmarkOutline} slot="end" className="bookmark" />
  </IonButton>
)};