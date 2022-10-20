import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const COLLECTION_USERS = "users";
//TODO: Add city to user model
export async function createUser(newUser) {
  let result;
  try {
    // Create user in Firebase Authentication
    const response = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);

    // Save user to Firebase Cloud Firestore in the users collection.
    await setDoc(doc(db, COLLECTION_USERS, response.user.uid), {
      uid: response.user.uid,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      location: newUser.location,
      createdAt: Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date()),
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
      message: "Something went wrong trying to create a new account.",
      status: 400,
    };
  }
  return result;
}

export async function signIn(user) {
  let result;
  try {
    // TODO: Implement other means of sign in? E.g. google, facebook and such
    const response = await signInWithEmailAndPassword(auth, user.email, user.password);
    localStorage.setItem("userIsAuthenticated", "true");
    // Update status of user so the user appears online when logged in.
    await updateDoc(doc(db, COLLECTION_USERS, response.user.uid), {
      isOnline: "online",
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
  try {
    await updateDoc(doc(db, COLLECTION_USERS, auth.currentUser.uid), {
      lastOnline: Timestamp.fromDate(new Date()),
      isOnline: "offline",
    });
    localStorage.removeItem("userIsAuthenticated");

    await signOut(auth);
  } catch (e) {
    console.log(e);
  }
}

/*
 * In this function we just update the user status to appear online
 */
export async function updateUserStatus(status) {
  try {
    if (status === "online") {
      await updateDoc(doc(db, COLLECTION_USERS, auth.currentUser.uid), {
        isOnline: "online",
      });
    } else {
      await updateDoc(doc(db, COLLECTION_USERS, auth.currentUser.uid), {
        isOnline: "offline",
        lastOnline: Timestamp.fromDate(new Date()),
      });
    }
  } catch (e) {
    console.log(e);
  }
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

// This function is called on the profile page to update the user information
export async function updateUser(user, shouldUpdatePassword, shouldUpdateEmail) {
  try {
    // Update email and password in Firebase Authentication
    if (shouldUpdatePassword) {
      console.log("Updating password");
      await updatePassword(auth.currentUser, user.password);
    }
    if (shouldUpdateEmail) {
      console.log("Updating email");
      await updateEmail(auth.currentUser, user.email);
    }

    await updateDoc(doc(db, COLLECTION_USERS, auth.currentUser.uid), {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });

    console.log("User updated successfully");

    return { status: 200 };
  } catch (e) {
    console.log(e);
    return { status: 400 };
  }
}

// get all users
export async function getAllUsers() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_USERS));
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data());
    });
    return { data: users, status: 200 };
  } catch (e) {
    console.log(e);
    return { status: 400 };
  }
}
