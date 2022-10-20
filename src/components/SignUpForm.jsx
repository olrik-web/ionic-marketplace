import { IonItem, IonLabel, IonInput, IonButton, IonNote, useIonViewWillEnter } from "@ionic/react";
import { useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { useHistory } from "react-router";
import { getLocationCity } from "../util/location.server";
import { Capacitor } from "@capacitor/core";

export default function SignUpForm({ handleSubmit }) {
  let history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [city, setCity] = useState("");

  // Error validation
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");

  useIonViewWillEnter(() => {
    // Getting the location of the device.
    setCurrentPosition();
  });

  function submitEvent(event) {
    event.preventDefault();
    const validationSuccess = handleValidation();

    if (validationSuccess) {
      const formData = {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        image: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
        location: {
          latitude: latitude,
          longitude: longitude,
        },
        city,
      };
      handleSubmit(formData);
    }
  }

  function handleValidation() {
    let validationSuccess = true;

    // Regex to check if email is a valid format
    const regex = RegExp(
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
    );
    if (email.length === 0) {
      setEmailError("Email is required");
      validationSuccess = false;
    } else if (regex.test(email) === false) {
      setEmailError("Wrong email format");
    } else {
      setEmailError("");
    }
    // Password validation
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      validationSuccess = false;
    } else {
      setPasswordError("");
    }
    if (password !== repeatPassword) {
      setRepeatPasswordError("Passwords must match");
      validationSuccess = false;
    } else {
      setRepeatPasswordError("");
    }
    // Name validation
    if (firstName.length === 0) {
      setFirstNameError("First name is required");
      validationSuccess = false;
    } else {
      setFirstNameError("");
    }
    if (lastName.length === 0) {
      setLastNameError("Last name is required");
      validationSuccess = false;
    } else {
      setLastNameError("");
    }

    return validationSuccess;
  }

  // Getting the location of the device and setting states with the data.
  async function setCurrentPosition() {
    if (Capacitor.isNativePlatform()) {
      // Check if the user has granted permission to use their location (only works on mobile)
      const hasPermission = await Geolocation.checkPermissions();
      if (
        hasPermission.coarseLocation.toLowerCase() === "granted" ||
        hasPermission.location.toLowerCase() === "granted"
      ) {
        // If they have, get the current position
        const locationData = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        setLatitude(locationData.coords.latitude);
        setLongitude(locationData.coords.longitude);
        setCityLocation(locationData.coords.latitude, locationData.coords.longitude);
      } else {
        // If they haven't, ask for permission
        const permission = await Geolocation.requestPermissions();
        if (permission.coarseLocation.toLowerCase() === "granted" || permission.location.toLowerCase() === "granted") {
          // If they grant permission, get the current position
          const locationData = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
          setLatitude(locationData.coords.latitude);
          setLongitude(locationData.coords.longitude);
          setCityLocation(locationData.coords.latitude, locationData.coords.longitude);
        }
      }
    } else {
      // If the user is on a browser, get the current position
      const locationData = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      setLatitude(locationData.coords.latitude);
      setLongitude(locationData.coords.longitude);
      setCityLocation(locationData.coords.latitude, locationData.coords.longitude);
    }
  }

  async function setCityLocation(latitude, longitude) {
    const locationCity = await getLocationCity(latitude, longitude);
    if (locationCity.status === 200) {
      setCity(locationCity);
    }
  }

  function goToLogin() {
    history.goBack();
  }

  return (
    <form onSubmit={submitEvent}>
      <IonItem class="ion-invalid">
        <IonLabel position="stacked">Email</IonLabel>
        <IonInput value={email} placeholder="example@email.com" onIonChange={(e) => setEmail(e.target.value)} />
        <IonNote slot="error">{emailError}</IonNote>
      </IonItem>
      <IonItem class="ion-invalid">
        <IonLabel position="stacked">Password</IonLabel>
        <IonInput
          value={password}
          placeholder="Type your password"
          onIonChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <IonNote slot="error">{passwordError}</IonNote>
      </IonItem>
      <IonItem class="ion-invalid">
        <IonLabel position="stacked">Repeat password</IonLabel>
        <IonInput
          value={repeatPassword}
          placeholder="Repeat your password"
          onIonChange={(e) => setRepeatPassword(e.target.value)}
          type="password"
        />
        <IonNote slot="error">{repeatPasswordError}</IonNote>
      </IonItem>
      <IonItem class="ion-invalid">
        <IonLabel position="stacked">First name</IonLabel>
        <IonInput
          value={firstName}
          placeholder="Type your first name"
          onIonChange={(e) => setFirstName(e.target.value)}
        />
        <IonNote slot="error">{firstNameError}</IonNote>
      </IonItem>
      <IonItem class="ion-invalid">
        <IonLabel position="stacked">Last name</IonLabel>
        <IonInput value={lastName} placeholder="Type your last name" onIonChange={(e) => setLastName(e.target.value)} />
        <IonNote slot="error">{lastNameError}</IonNote>
      </IonItem>
      <div className="btnsLogin">
        <IonButton type="submit">Sign up</IonButton>
        <IonButton type="button" fill="outline" onClick={goToLogin}>
          Cancel
        </IonButton>
      </div>
    </form>
  );
}
