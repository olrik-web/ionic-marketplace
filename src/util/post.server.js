import {
  addDoc,
  doc,
  getDocs,
  collection,
  Timestamp,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "./firebase";

const COLLECTION_POSTS = "posts";

export async function createPost(newPost) {
  let result;

  try {
    await addDoc(collection(db, COLLECTION_POSTS), {
      ...newPost,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
      createdBy: auth.currentUser.uid,
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

// get posts by user id (createdBy) and return them.
export async function getPostsCurrentUser() {
  let result;
  try {
    const snapshot = await getDocs(collection(db, COLLECTION_POSTS));
    // filter posts by user id (createdBy) and return them with post (document) id.
    // TODO: add pagination. (limit, offset)
    const posts = snapshot.docs
      .map((doc) => {
        return { ...doc.data(), id: doc.id };
      })
      .filter((post) => post.createdBy === auth.currentUser.uid);

    result = {
      message: "Posts were fetched succesfully.",
      status: 200,
      posts: posts,
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


// This function is used to update a post. It takes the post id and the new post data.
export async function updatePost(post) {
  let result;
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
