import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const COLLECTION_USERS = "users";

export async function createUser(newUser) {
  let result;
  try {
    // Create user in Firebase Authentication
    const response = await createUserWithEmailAndPassword(
      auth,
      newUser.email,
      newUser.password
    );

    // Save user to Firebase Cloud Firestore in the users collection.
    await setDoc(doc(db, COLLECTION_USERS, response.user.uid), {
      uid: response.user.uid,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      createdAt: Timestamp.fromDate(new Date()),
    });

    // Response is good.
    result = {
      message: "Account was created succesfully.",
      status: 200,
    };
  } catch (e) {
    // Response was bad.
    console.log(e);
    result = {
      message: "Something went wrong trying to create a new user.",
      status: 400,
    };
  }
  return result;
}

export async function signIn(user) {
  let result;
  try {
    // TODO: Implement other means of sign in? E.g. google, github and such
    const response = await signInWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );

    // Update status of user so the user appears online when logged in.
    await updateDoc(doc(db, COLLECTION_USERS, response.user.uid), {
      isOnline: true,
    });

    // Response is good.
    result = {
      message: "Sign in success.",
      status: 200,
    };
  } catch (e) {
    // Response was bad.
    console.log(e);
    result = {
      message: "Something went wrong trying to sign in.",
      status: 400,
    };
  }
  return result;
}

/*
 * In this function we sign out the user. We update the lastOnline and isOnline field
 * and call the Firebase Authentication signOut function
 */
export async function signOutUser() {
  await updateDoc(doc(db, COLLECTION_USERS, auth.currentUser.uid), {
    lastOnline: Timestamp.fromDate(new Date()),
    isOnline: false,
  });
  await signOut(auth);
}

/*
 * In this function we just update the user status to appear online
 */
export async function updateUserStatus() {
  await updateDoc(doc(db, COLLECTION_USERS, auth.currentUser.uid), {
    isOnline: true,
  });
}

/*
 * In this function we get a user using an id. It can be the currently logged in user
 * or a different user.
 */
export async function getUser(uid) {
  const docRef = doc(db, COLLECTION_USERS, uid);

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { data: docSnap.data(), status: 200 };
    } else {
      console.log("Document does not exist");
      return { status: 400 };
    }
  } catch (error) {
    console.log(error);
    return { status: 400 };
  }
}
