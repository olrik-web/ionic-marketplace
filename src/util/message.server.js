import { db } from "./firebase";
import { collection, addDoc, getDocs, query, orderBy, onSnapshot } from "firebase/firestore";

const URL =
  "https://ionic-marketplace-adde9-default-rtdb.europe-west1.firebasedatabase.app";


// export async function sendMessage(message) {
//   const stringId = JSON.parse(message.user1);
//   message.user1 = stringId;

//   let result;
//   try {
//     // Getting all chat rooms
//     const chatRooms = await getChatRooms();

//     let chatRoom = chatRooms.fields.find(
//       (chat) =>
//         (chat.user1 === message.user1 && chat.user2 === message.user2) ||
//         (chat.user1 === message.user2 && chat.user2 === message.user1)
//     );
//     //Info to post
//     let response;
//     const postMessage = {
//       text: message.text,
//       date: Date.now(),
//       sender: message.user1,
//     };

//     // If no chat room exist we create one
//     if (!chatRoom) {
//       chatRoom = await createChatRoom(message.user1, message.user2);
//       // Now we post the message
//       response = await fetch(
//         `${URL}/chatRooms/${chatRoom.fields.name}/messages.json`,
//         {
//           method: "POST",
//           body: JSON.stringify(postMessage),
//         }
//       );
//     } else {
//       response = await fetch(`${URL}/chatRooms/${chatRoom.id}/messages.json`, {
//         method: "POST",
//         body: JSON.stringify(postMessage),
//       });
//     }

//     // Response is good.
//     result = {
//       message: "Message was created succesfully.",
//       fields: await response.json(),
//       status: 200,
//     };
//   } catch (e) {
//     // Response was bad.
//     console.log(e);
//     result = {
//       message: "Something went wrong trying to create a new message.",
//       fields: { message },
//       status: 400,
//     };
//   }
//   return result;
// }

// export async function createChatRoom(user1, user2) {
//   let result;
//   try {
//     const chatRoom = {
//       messages: [],
//       user1: user1,
//       user2: user2,
//     };
//     // Attempting to create a user.
//     const response = await fetch(`${URL}/chatRooms.json`, {
//       method: "POST",
//       body: JSON.stringify(chatRoom),
//     });

//     // Response is good.
//     result = {
//       message: "Chat room was created succesfully.",
//       fields: await response.json(),
//       status: 200,
//     };
//   } catch (e) {
//     // Response was bad.
//     console.log(e);
//     result = {
//       message: "Something went wrong trying to create a new chat room.",
//       fields: {},
//       status: 400,
//     };
//   }
//   return result;
// }
// export async function getChatRooms() {
//   let result;
//   try {
//     // Attempting to create a user.
//     const response = await fetch(`${URL}/chatRooms.json`);
//     const data = await response.json();

//     let postsArray = [];
//     if (data) {
//       // from object to array
//       postsArray = Object.keys(data).map((key) => ({
//         id: key,
//         ...data[key],
//       }));
//     }

//     // Response is good.
//     result = {
//       message: "Fetched all chat rooms succesfully.",
//       fields: postsArray,
//       status: 200,
//     };
//   } catch (e) {
//     // Response was bad.
//     console.log(e);
//     result = {
//       message: "Something went wrong trying to fetch all chat rooms.",
//       fields: {},
//       status: 400,
//     };
//   }
//   return result;
// }

// export async function getMessages(user1, user2) {
  // const stringId = JSON.parse(user1);
  // const chatRooms = await getChatRooms();
  // let chatRoom = chatRooms.fields.find(
  //   (chat) =>
  //     (chat.user1 === stringId && chat.user2 === user2) ||
  //     (chat.user1 === user2 && chat.user2 === stringId)
  // );

  // let result;
  // if (chatRoom) {
  //   try {
  //     // Attempting to create a user.
  //     const response = await fetch(
  //       `${URL}/chatRooms/${chatRoom.id}/messages.json`
  //     );
  //     const data = await response.json();
  //     let messagesArray = [];
  //     if (data) {
  //       // from object to array
  //       messagesArray = Object.keys(data).map((key) => ({
  //         id: key,
  //         ...data[key],
  //       }));
  //     }

  //     // Response is good.
  //     result = {
  //       message: "Fetched messages succesfully.",
  //       fields: messagesArray,
  //       status: 200,
  //     };
  //   } catch (e) {
  //     // Response was bad.
  //     console.log(e);
  //     result = {
  //       message: "Messages not found.",
  //       fields: [],
  //       status: 400,
  //     };
  //   }
  // } else {
  //   result = {
  //     message: "Chatroom not found.",
  //     fields: [],
  //     status: 400,
  //   };
  // }

  // return result;
// }

export async function createMessage(message) {
  const stringId = JSON.parse(message.user1);
  message.user1 = stringId;
  console.log(message);

  try {
    const docRef = await addDoc(collection(db, "messages"), {
      text: message.text,
      date: Date.now(),
      user1: message.user1,
      user2: message.user2,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
