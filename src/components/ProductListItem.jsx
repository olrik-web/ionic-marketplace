import {
  IonItem,
  IonImg,
  IonAvatar,
  IonLabel,
  IonCardHeader,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonIcon,
  IonButton,
} from "@ionic/react";
import "./ProductListItem.css";
import { pin, bookmark, wine, warning, walk } from "ionicons/icons";

export default function ProductListItem({ product }) {
  return (
    // <ion-card>
    //   <IonItem button key={product.uid} routerLink={`products/${product.uid}`}>
    //     <IonImg className="product-img" src={product.image} />
    //     <IonLabel>
    //       <h2>{product.title}</h2>
    //       <h5>{product.price} KR</h5>
    //       <h5>Størrelse: {product.size}</h5>
    //     </IonLabel>
    //   </IonItem>
    // </ion-card>

    <IonCard
      className="ionCard"
      button
      key={product.uid}
      routerLink={`products/${product.uid}`}
    >
      <IonImg className="product-img" src={product.image} />
      <IonCardHeader>
        <IonCardSubtitle className="product-price">
          {product.price} kr
        </IonCardSubtitle>
        <IonCardTitle className="product-title">{product.title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="ionCard-content">
        <p className="product-size">Størrelse: {product.size} </p>
        <p className="product-location">Aarhus</p>
        <IonIcon icon={bookmark} slot="end" className="bookmark" />
      </IonCardContent>
    </IonCard>

    // <IonPage>
    //   <IonHeader>
    //     <IonToolbar>
    //       <IonTitle>CardExamples</IonTitle>
    //     </IonToolbar>
    //   </IonHeader>
    //   <IonContent>
    //     <IonCard>
    //       <IonCardHeader>
    //         <IonCardSubtitle>Card Subtitle</IonCardSubtitle>
    //         <IonCardTitle>{product.title}</IonCardTitle>
    //       </IonCardHeader>

    //       <IonCardContent>
    //         Keep close to Nature's heart... and break clear away, once in
    //         awhile, and climb a mountain or spend a week in the woods. Wash your
    //         spirit clean.
    //       </IonCardContent>
    //     </IonCard>

    //     <IonCard>
    //       <IonItem>
    //         <IonIcon icon={pin} slot="start" />
    //         <IonLabel>ion-item in a card, icon left, button right</IonLabel>
    //         <IonButton fill="outline" slot="end">
    //           View
    //         </IonButton>
    //       </IonItem>

    //       <IonCardContent>
    //         This is content, without any paragraph or header tags, within an
    //         ion-cardContent element.
    //       </IonCardContent>
    //     </IonCard>

    //     <IonCard>
    //       <IonItem href="#" className="ion-activated">
    //         <IonIcon icon={wifi} slot="start" />
    //         <IonLabel>Card Link Item 1 activated</IonLabel>
    //       </IonItem>

    //       <IonItem href="#">
    //         <IonIcon icon={wine} slot="start" />
    //         <IonLabel>Card Link Item 2</IonLabel>
    //       </IonItem>

    //       <IonItem className="ion-activated">
    //         <IonIcon icon={warning} slot="start" />
    //         <IonLabel>Card Button Item 1 activated</IonLabel>
    //       </IonItem>

    //       <IonItem>
    //         <IonIcon icon={walk} slot="start" />
    //         <IonLabel>Card Button Item 2</IonLabel>
    //       </IonItem>
    //     </IonCard>
    //   </IonContent>
    // </IonPage>
  );
}
