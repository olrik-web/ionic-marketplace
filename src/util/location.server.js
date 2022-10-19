import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
// TODO: Move access key to .env file and use it here.
// const ACCESS_KEY = process.env.ACCESS_KEY;
const ACCESS_KEY = "3e2377e0cb7643c88689b53e1c990162";

// This function gets the location of the user using coordinates and returns the city.
export async function getLocationCity(lat, long) {
  try {
    const response = await fetch(
      `http://api.positionstack.com/v1/reverse?access_key=${ACCESS_KEY}
&query=${lat},${long}&limit=1`
    );
    const data = await response.json();
    return { locality: data.data[0].locality, status: 200, message: "Success" };
  } catch (error) {
    console.log(error);
    return { status: 400, message: "Error changing location..." };
  }
}

// This function updates the location of the user in the database. It takes the user id and the new location.
export async function updateLocation(locality, latitude, longitude) {
  try {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      city: locality,
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      updatedAt: Timestamp.fromDate(new Date()),
    });
    return { status: 200, message: "Success" };
  } catch (error) {
    console.log(error);
    return { status: 400, message: "Error changing location..." };
  }
}
