import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";

export default function AddProduct() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Product</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Add Product</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Add product" />
      </IonContent>
    </IonPage>
  );
}
