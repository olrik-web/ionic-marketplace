import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
} from "@ionic/react";
import { useEffect, useState } from "react";
import ProductListItem from "./../components/ProductListItem";

const HomePage = () => {
  const [products, setProducts] = useState([]);

  async function loadProducts() {
    const url =
      "https://ionicmarketplace-e8a41-default-rtdb.firebaseio.com/products/.json";
    const response = await fetch(url);
    const data = await response.json();
    const productsArray = Object.keys(data).map((key) => ({
      id: key,
      ...data[key],
    })); // from object to array
    setProducts(productsArray.reverse());
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <IonPage className="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <div className="ionCard-item">
            {products.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </div>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
