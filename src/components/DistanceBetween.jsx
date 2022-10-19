import { useEffect, useState } from "react";
import { getDistanceFromLatLonInKm } from "../util/helperMethods";

export default function DistanceBetween({ seller, buyer }) {
  const [distance, setDistance] = useState();

  useEffect(() => {
    // Getting the location of seller and buyer and calculating the distance between them.
    function getDistance() {
      const sellerLocation = seller?.location;
      const buyerLocation = buyer?.location;
      if (sellerLocation && buyerLocation) {
        const distance = getDistanceFromLatLonInKm(
          sellerLocation.latitude,
          sellerLocation.longitude,
          buyerLocation.latitude,
          buyerLocation.longitude
        );
        setDistance(Math.ceil(distance));
      }
    }
    getDistance();
  }, [buyer.location, seller.location]);

  return <span>{distance}</span>;
}
