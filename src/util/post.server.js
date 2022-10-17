import { setDoc, doc, getDocs, collection } from "firebase/firestore";
import { newspaper } from "ionicons/icons";
import { db } from "./firebase";

const COLLECTION_POSTS = "posts";

export async function createPost(newPost) {
  let result;

  try {
    await setDoc(doc(db, COLLECTION_POSTS, "posts"), {
      Title: newPost.title,
      price: newPost.price,
      size: newPost.size,
      image: newPost.image,
      description: newPost.description,
      postId: newPost.postId,
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
