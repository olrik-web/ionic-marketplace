import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
} from "@ionic/react";
import { useState } from "react";
import ProductCard from "../components/ProductCard";

export default function SearchPage() {
  const [searchText, setSearchText] = useState("");

  // Create array of objects
  const items = [
    { title: "Apple", type: "Fruit" },
    { title: "Banana", type: "Fruit" },
    { title: "Carrot", type: "Vegetable" },
    { title: "Potato", type: "Vegetable" },
  ];

  // Filter array of objects
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Search</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar
          autocorrect="on"
          spellcheck={true}
          showClearButton="focus"
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value)}
        ></IonSearchbar>
        {filteredItems.map((item, index) => (
          <ProductCard product={item} key={index} />
        ))}
      </IonContent>
    </IonPage>
  );
}
