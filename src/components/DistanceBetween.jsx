import { useEffect, useState } from "react";
import { getDistanceFromLatLonInKm } from "../util/helperMethods";

export default function DistanceBetween({ seller, buyer }) {
  const [distance, setDistance] = useState();

  useEffect(() => {
    // Getting the location of seller and buyer and calculating the distance between them.
    function getDistance() {
      if (seller && buyer) {
        const distance = getDistanceFromLatLonInKm(seller.latitude, seller.longitude, buyer.latitude, buyer.longitude);
        setDistance(Math.ceil(distance));
      }
    }
    getDistance();
  }, [buyer, seller]);

  return <span>{distance}</span>;
}
