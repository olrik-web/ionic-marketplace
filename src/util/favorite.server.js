import { db, auth } from "./firebase";
import { addDoc, collection, getDocs, docs, doc, where, deleteDoc } from "firebase/firestore";

const COLLECTION_FAVORITES = "favorites";

export async function createFavorite(postId) {
  let result;
  try {
    const docRef = await addDoc(collection(db, COLLECTION_FAVORITES), {
      postId: postId,
      userId: auth.currentUser.uid,
    });
    result = {
      message: "Favorite was created succesfully.",
      status: 200,
      id: docRef.id,
    };
  } catch (e) {
    console.log(e);
    result = {
      message: "Something went wrong trying to create a new favorite.",
      status: 400,
    };
  }
  return result;
}

export async function getFavorite(postId) {
  let result;
  try {
    const snapshot = await getDocs(
      collection(db, COLLECTION_FAVORITES),
      where("postId", "==", postId),
      where("userId", "==", auth.currentUser.uid)
    );
    result = {
      message: "Favorites were fetched succesfully.",
      status: 200,
    favorites: snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
    };
  } catch (e) {
    console.log(e);
    result = {
      message: "Something went wrong trying to get favorites.",
      status: 400,
    };
  }
  return result;
}

export async function deleteFavorite(postId) {
    let result;
    try {
        const snapshot = await getDocs(
        collection(db, COLLECTION_FAVORITES),
        where("postId", "==", postId),
        where("userId", "==", auth.currentUser.uid)
        );
        const docId = snapshot.docs[0].id;
        await deleteDoc(doc(db, COLLECTION_FAVORITES, docId));
        result = {
        message: "Favorite was deleted succesfully.",
        status: 200,
        };
    } catch (e) {
        console.log(e);
        result = {
        message: "Something went wrong trying to delete a favorite.",
        status: 400,
        };
    }
    return result;
    }