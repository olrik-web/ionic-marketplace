import { addDoc, collection, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_CHATROOMS = "chatRooms";
const COLLECTION_MESSAGES = "messages";

// Creating a query to get messages inside the chatRooms collection. Messages are ordered by createdAt Timestamp
export function messageQuery(currentUserId, otherUserId) {
  try {
    // ChatRoom document id is either currentUserId + otherUserId or the other way around
    const docId = currentUserId > otherUserId ? currentUserId + otherUserId : otherUserId + currentUserId;
    const messagesRef = collection(db, COLLECTION_CHATROOMS, docId, COLLECTION_MESSAGES);
    return query(messagesRef, orderBy("createdAt", "asc"));
  } catch (e) {
    console.log(e);
  }
}

export async function createMessage(currentUserId, otherUserId, message) {
  try {
    // ChatRoom document id is either currentUserId + otherUserId or the other way around
    const docId = currentUserId > otherUserId ? currentUserId + otherUserId : otherUserId + currentUserId;
    await addDoc(collection(db, COLLECTION_CHATROOMS, docId, COLLECTION_MESSAGES), message);
    return { status: 200, message: "The message has been sent." };
  } catch (e) {
    console.log(e);
    return { status: 400, message: "Something went wrong trying to send the message." };
  }
}

export async function deleteMessage(currentUserId, otherUserId, messageId) {
  try {
    // ChatRoom document id is either currentUserId + otherUserId or the other way around
    const docId = currentUserId > otherUserId ? currentUserId + otherUserId : otherUserId + currentUserId;
    await deleteDoc(doc(db, COLLECTION_CHATROOMS, docId, COLLECTION_MESSAGES, messageId));
    return { status: 200, message: "The message has been deleted." };
  } catch (e) {
    console.log(e);
    return { status: 400, message: "Something went wrong trying to delete the message." };
  }
}
