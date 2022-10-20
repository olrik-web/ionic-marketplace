import { IonIcon } from "@ionic/react";
import "./PostCard.css";
import { bookmark, bookmarkOutline } from "ionicons/icons";
import { useEffect } from "react";
import { IonButton } from "@ionic/react";
import { createFavorite, deleteFavorite, getFavorite } from "../util/favorite.server";
import { useState } from "react";
import { auth } from "../util/firebase";

export default function Favorite({ product, getPosts, getBookmarkedPosts }) {
  const [favorite, setFavorite] = useState();
  useEffect(() => {
    async function fetchFavorite() {
      if (auth?.currentUser?.uid) {
        const result = await getFavorite(product.id);
        if (result.status === 200) {
          setFavorite(result.data);
        }
      }
    }
    fetchFavorite();
  }, [product.id]);

  async function handleFavorite(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!favorite) {
      const result = await createFavorite(product.id);
      if (result.status === 200) {
        setFavorite(true);
      }
    } else {
      const result = await deleteFavorite(product.id);
      if (result.status === 200) {
        setFavorite(false);
      }
    }
    // TODO: Reload the bookmarked posts. Calling getBookmarkedPosts() here does not work.
    // getPosts();
    // getBookmarkedPosts();
  }

  return (
    <IonButton color={"secondary"} fill={"clear"} onClick={handleFavorite} slot="end">
      <IonIcon icon={favorite ? bookmark : bookmarkOutline} />
    </IonButton>
  );
}
