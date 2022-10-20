import { db, auth } from "./firebase";
import { addDoc, collection, getDocs, doc, where, deleteDoc, query } from "firebase/firestore";

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

// Get all favorites based on the user id from the current logged in user
export async function getFavorite(postId) {
  let result = {
    message: "Favorite not found.",
    status: 400,
  };
  try {
    const q = query(collection(db, COLLECTION_FAVORITES), where("userId", "==", auth.currentUser.uid));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().postId === postId) {
        result = {
          message: "Favorite was found.",
          status: 200,
          data: { ...doc.data(), id: doc.id },
        };
        return;
      }
    });
  } catch (e) {
    console.log(e);
    result = {
      message: "Something went wrong trying to fetch favorites.",
      status: 400,
    };
  }
  return result;
}

// Get all favorites based on the user id from the current logged in user
export async function getFavoritedPosts() {
  let result;
  try {
    const q = query(collection(db, COLLECTION_FAVORITES), where("userId", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    result = {
      message: "Favorites were fetched succesfully.",
      status: 200,
      data: querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
    };
  } catch (e) {
    console.log(e);
    result = {
      message: "Something went wrong trying to fetch favorites.",
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

// Function that deletes all favorites using a post id
export async function deleteAllFavorites(postId) {
  let result;
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_FAVORITES), where("postId", "==", postId));
    snapshot.forEach((document) => {
      deleteDoc(doc(db, COLLECTION_FAVORITES, document.id));
    });
    result = {
      message: "Favorites were deleted succesfully.",
      status: 200,
    };
  } catch (e) {
    console.log(e);
    result = {
      message: "Something went wrong trying to delete favorites.",
      status: 400,
    };
  }
  return result;
}