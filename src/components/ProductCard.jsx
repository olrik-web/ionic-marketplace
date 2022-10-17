import { IonCard, IonCardHeader, IonCardSubtitle,IonCardTitle, IonCardContent, IonButton } from "@ionic/react";



export default function ProductCard({ product }) {
    return (
        <IonCard>
        <IonCardHeader>
            <IonCardSubtitle>Product</IonCardSubtitle>
            <IonCardTitle>{product.title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
            <IonButton>View</IonButton>
        </IonCardContent>
        </IonCard>
    );
    }