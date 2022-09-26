import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import brcypt from "react-native-bcrypt";
import { auth, db } from "./firebase";

const URL = "https://ionic-marketplace-adde9-default-rtdb.europe-west1.firebasedatabase.app";
const COLLECTION_USERS = "users";
const COLLECTION_MESSAGES = "messages";

export async function createUser(newUser) {
  let result;
  try {
    // // Hashing the password using salt
    // const salt = brcypt.genSaltSync(10);
    // newUser.password = brcypt.hashSync(newUser.password, salt);

    // Attempting to create a user.
    // const response = await fetch(`${URL}/users.json`, {
    //   method: "POST",
    //   body: JSON.stringify(newUser),
    // });

    // Create user in Firebase Authentication
    const response = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);

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
    const response = await signInWithEmailAndPassword(auth, user.email, user.password);

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

export async function signOutUser() {
  await updateDoc(doc(db, COLLECTION_USERS, auth.currentUser.uid), {
    lastOnline: Timestamp.fromDate(new Date()),
    isOnline: false,
  });
  await signOut(auth);
}
export async function updateUserStatus() {
  await updateDoc(doc(db, COLLECTION_USERS, auth.currentUser.uid), {
    isOnline: true,
  });
}

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


// export async function validateUser(user) {
//   let result;
//   try {
//     // Getting all users.
//     const response = await fetch(`${URL}/users.json`);
//     const data = await response.json();

//     // from object to array
//     const postsArray = Object.keys(data).map((key) => ({
//       id: key,
//       ...data[key],
//     }));
//     // Finding the specific user trying to log in
//     const userData = postsArray.find((u) => u.email === user.email);

//     // Checking if password is correct
//     const userValidated = brcypt.compareSync(user.password, userData.password);
//     if (userValidated) {
//       // Password correct. Setting local storage
//       localStorage.setItem("user", JSON.stringify(userData.id));
//       result = {
//         message: "Logged in successfully.",
//         fields: userData,
//         status: 200,
//       };
//     } else {
//       // Password incorrect
//       result = {
//         message: "Login failed. Please check email and password.",
//         fields: userData,
//         status: 400,
//       };
//     }
//   } catch (e) {
//     // Response was bad.
//     console.log(e);
//     result = {
//       message: "User was not found. Please verify your email.",
//       fields: { user },
//       status: 400,
//     };
//   }
//   return result;
// }

// export async function getUsers() {
//   let result;
//   try {
//     // Getting all users.
//     const response = await fetch(`${URL}/users.json`);
//     const data = await response.json();

//     // from object to array
//     const postsArray = Object.keys(data).map((key) => ({
//       id: key,
//       ...data[key],
//     }));

//     // Response is good.
//     result = {
//       message: "Fetched users succesfully.",
//       fields: postsArray,
//       status: 200,
//     };
//   } catch (e) {
//     // Response was bad.
//     console.log(e);
//     result = {
//       message: "Users were not found.",
//       fields: {},
//       status: 400,
//     };
//   }
//   return result;
// }

// export async function getCurrentUser(id) {
//   // We parse the json to get rid of quotation marks which makes fetching the user using the id difficult.
//   const stringId = JSON.parse(id);
//   let result;
//   try {
//     // Getting all users.
//     const response = await fetch(`${URL}/users/${stringId}.json`);
//     const data = await response.json();

//     // Response is good.
//     result = {
//       message: "Fetched users succesfully.",
//       fields: data,
//       status: 200,
//     };
//   } catch (e) {
//     // Response was bad.
//     console.log(e);
//     result = {
//       message: "Users were not found.",
//       fields: {},
//       status: 400,
//     };
//   }
//   return result;
// }
// export async function getUser(id) {
//   let result;
//   try {
//     // Getting all users.
//     const response = await fetch(`${URL}/users/${id}.json`);
//     const data = await response.json();

//     // Response is good.
//     result = {
//       message: "Fetched users succesfully.",
//       fields: data,
//       status: 200,
//     };
//   } catch (e) {
//     // Response was bad.
//     console.log(e);
//     result = {
//       message: "Users were not found.",
//       fields: {},
//       status: 400,
//     };
//   }
//   return result;
// }
