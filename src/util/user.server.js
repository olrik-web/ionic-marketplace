import bcrypt from "bcryptjs";

const URL =
  "https://ionic-marketplace-adde9-default-rtdb.europe-west1.firebasedatabase.app/";

export async function createUser(newUser) {
  let result;
  try {
    // Hashing the password using salt
    const salt = bcrypt.genSaltSync(10);
    newUser.password = bcrypt.hashSync(newUser.password, salt);

    // Attempting to create a user.
    const response = await fetch(URL + "users.json", {
      method: "POST",
      body: JSON.stringify(newUser),
    });

    // Response is good.
    result = {
      message: "Account was created succesfully.",
      fields: await response.json(),
      status: 200,
    };
  } catch (e) {
    // Response was bad.
    console.log(e);
    result = {
      message: "Something went wrong trying to create a new user.",
      fields: { newUser },
      status: 400,
    };
  }
  return result;
}

export async function validateUser(user) {
  let result;
  try {
    // Getting all users.
    const response = await fetch(URL + "users.json");
    const data = await response.json();

    // from object to array
    const postsArray = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    }));
    // Finding the specific user trying to log in
    const userData = postsArray.find((u) => u.email === user.email);

    // Checking if password is correct
    const userValidated = bcrypt.compareSync(user.password, userData.password);
    if (userValidated) {
      // Password correct. Setting local storage
      localStorage.setItem("user", JSON.stringify(userData.id));
      result = {
        message: "Logged in successfully.",
        fields: userData,
        status: 200,
      };
    } else {
      // Password incorrect
      result = {
        message: "Login failed. Please check email and password.",
        fields: userData,
        status: 400,
      };
    }
  } catch (e) {
    // Response was bad.
    console.log(e);
    result = {
      message: "User was not found. Please verify your email.",
      fields: { user },
      status: 400,
    };
  }
  return result;
}

export async function signOut() {
    localStorage.clear();
}