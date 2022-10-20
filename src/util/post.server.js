import {
  addDoc,
  doc,
  getDocs,
  collection,
  Timestamp,
  deleteDoc,
  updateDoc,
  getDoc,
  orderBy,
  query,
  limit,
  startAfter,
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

// Get posts with pagination and sort by createdAt field (descending).
export async function getPostsPaginated(limiter, lastPostId) {
  let result;
  try {
    // get last post from db
    const postsRef = collection(db, COLLECTION_POSTS);
    const lastPostSnapshot = await getDoc(doc(db, COLLECTION_POSTS, lastPostId));

    // Construct a new query starting at the document after the last visible post and get the next posts (limit). Order by createdAt field (descending).
    const next = query(postsRef, orderBy("createdAt", "desc"), startAfter(lastPostSnapshot), limit(limiter));

    const snapshot = await getDocs(next);

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

// Get posts with pagination and sort by createdAt field (descending).
export async function getPostsLimit(limiter) {
  let result;
  try {
    const postsRef = collection(db, COLLECTION_POSTS);
    const q = query(postsRef, orderBy("createdAt", "desc"), limit(limiter));
    const snapshot = await getDocs(q);

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
    const posts = snapshot.docs
      .map((doc) => {
        return { ...doc.data(), id: doc.id };
      })
      .filter((post) => post.createdBy === auth.currentUser.uid)
      .sort((a, b) => b.createdAt - a.createdAt);

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

// Get a post by its id.
export async function getPost(postId) {
  let result;
  try {
    const post = await getDoc(doc(db, COLLECTION_POSTS, postId));
    result = {
      message: "Post was fetched succesfully.",
      status: 200,
      post: { ...post.data(), id: post.id },
    };
  } catch (e) {
    console.log(e);
    result = {
      message: "Something went wrong trying to get a post.",
      status: 400,
    };
  }
  return result;
}
