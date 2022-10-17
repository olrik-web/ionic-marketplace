import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar } from "@ionic/react";
import { useContext, useState } from "react";
import { Redirect } from "react-router";
import ProductCard from "../components/ProductCard";
import { AuthContext } from "../context/auth";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";

export default function SearchPage() {
  const { user } = useContext(AuthContext);

  const [searchText, setSearchText] = useState('');
  
  // Create array of objects
  const items = [
    { title: 'Apple', type: 'Fruit' },
    { title: 'Banana', type: 'Fruit' },
    { title: 'Carrot', type: 'Vegetable' },
    { title: 'Potato', type: 'Vegetable' },
  ];


  // Filter array of objects
  const filteredItems = items.filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()));


  // Redirect to login if we're not logged in
  if (!user) {
    return <Redirect to="/login" />;
  }

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
        <IonSearchbar autocorrect = "on" spellcheck = {true} showClearButton="focus" value={searchText} onIonChange={(e)=>setSearchText(e.detail.value)}></IonSearchbar>
        {filteredItems.map((item, index) => (
           <ProductCard product={item} key={index} />
          
        ))}
        
      </IonContent>
    </IonPage>
  );
}
