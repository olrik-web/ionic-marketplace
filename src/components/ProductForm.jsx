import {
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonImg,
  IonButton,
  IonIcon,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { camera } from "ionicons/icons";
import { Geolocation } from "@capacitor/geolocation";
import { categories } from "../config/categories";

export default function PostForm({ post, handleSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageElement, setImageElement] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");

  const fallbackUrl =
    "https://media.istockphoto.com/photos/white-paper-texture-background-picture-id1293996796?b=1&k=20&m=1293996796&s=170667a&w=0&h=ot-Q4dcJynVUxQyjU5P7i4qPZxmoWmPC0M09R53D8j8=";

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setDescription(post.description);
      setImage(post.image);
    }
  }, [post]);

  function submitEvent(event) {
    event.preventDefault();
    setCurrentPosition();

    const formData = {
      title: title,
      description: description,
      image: imageElement ? imageElement : image,
      latitude: latitude ? latitude : 0,
      longitude: longitude ? longitude : 0,
      price: price,
      size: size,
      category: category,
    };
    handleSubmit(formData);
  }

  async function takePicture() {
    const image = await Camera.getPhoto({
      quality: 80,
      width: 500,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
    });

    var imageUrl = image.dataUrl;

    // Can be set to the src of an image now
    setImageElement(imageUrl);
  }

  async function setCurrentPosition() {
    const locationData = await Geolocation.getCurrentPosition();
    setLatitude(locationData.coords.latitude);
    setLongitude(locationData.coords.longitude);
  }

  return (
    <form onSubmit={submitEvent}>
      <IonItem>
        <IonLabel position="stacked">Title</IonLabel>
        <IonInput
          value={title}
          placeholder="Type the title of the post"
          onIonChange={(e) => setTitle(e.target.value)}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Price</IonLabel>
        <IonInput
          value={price}
          placeholder="Give your item a price"
          onIonChange={(e) => setPrice(e.target.value)}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Size</IonLabel>
        <IonInput
          value={size}
          placeholder="What size is your item?"
          onIonChange={(e) => setSize(e.target.value)}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Category</IonLabel>
        <IonSelect
          value={category}
          onIonChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((category) => (
            <IonSelectOption key={category} value={category}>
              {category}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Description</IonLabel>
        <IonTextarea
          value={description}
          placeholder="Give a description of the post"
          onIonChange={(e) => setDescription(e.target.value)}
        ></IonTextarea>
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Image URL</IonLabel>
        <IonInput
          value={image}
          type="url"
          placeholder="Paste url to your image"
          onIonChange={(e) => setImage(e.target.value)}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Image Preview</IonLabel>
        <IonImg
          className="ion-padding"
          src={image === "" ? fallbackUrl : image}
        />
      </IonItem>
      <IonItem>
        <IonLabel position="stacked">Or take a picture</IonLabel>
        <IonButton onClick={takePicture} color="primary">
          Upload Image
        </IonButton>
        <IonIcon icon={camera} slot="end" />
      </IonItem>

      {imageElement && (
        <IonItem>
          <IonLabel position="stacked">Image Preview</IonLabel>
          <IonImg src={imageElement} />
          <IonButton onClick={() => setImageElement("")} color="light">
            Remove Image
          </IonButton>
        </IonItem>
      )}

      <IonButton type="submit" expand="block">
        Save
      </IonButton>
    </form>
  );
}