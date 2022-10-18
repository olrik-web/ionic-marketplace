import {
  addDoc,
  doc,
  getDocs,
  collection,
  Timestamp,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
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
      posts: snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
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

// delte post

export async function deletePost(id) {
  let result;

  try {
    await deleteDoc(doc(db, COLLECTION_POSTS, id));
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

// update post

export async function updatePost(post) {
  let result;
  console.log(post.id);
  try {
    await updateDoc(doc(db, COLLECTION_POSTS, post.id), {
      ...post,
      updatedAt: Timestamp.fromDate(new Date()),
    });
    result = {
      message: "Post was updated succesfully.",
      status: 200,
    };
  } catch (e) {
    console.log(e);
    result = {
      message: "Something went wrong trying to update a post.",
      status: 400,
    };
  }
  return result;
}
