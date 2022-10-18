import { setDoc, addDoc, doc, getDocs, collection, Timestamp, deleteDoc } from "firebase/firestore";
import { newspaper } from "ionicons/icons";
import { db } from "./firebase";

const COLLECTION_POSTS = "posts";

export async function createPost(newPost) {
  let result;

  try {
    await addDoc(collection(db, COLLECTION_POSTS), {
      ...newPost,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
    });

    result = {
      message: "Post was created succesfully.",
      status: 200,
    };
  } catch (e) {
    console.log(e);
    result = {
      message: "Something went wrong trying to create a new post.",
      status: 400,
    };
  }
  return result;
}

export async function getPosts() {
  let result;
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_POSTS));
    result = {
      message: "Posts were fetched succesfully.",
      status: 200,
      posts: snapshot.docs.map((doc) => doc.data()),
    };
  } catch (e) {
    console.log(e);
    result = {
      message: "Something went wrong trying to get posts.",
      status: 400,
    };
  }
  return result;
}

// Delete a post from the database by its id.
export async function deletePost(postId) {
  let result;
  try {
    await deleteDoc(doc(db, COLLECTION_POSTS, postId));
    result = {
      message: "Post was deleted succesfully.",
      status: 200,
    };
  } catch (e) {
    console.log(e);
    result = {
      message: "Something went wrong trying to delete a post.",
      status: 400,
    };
  }
  return result;
}