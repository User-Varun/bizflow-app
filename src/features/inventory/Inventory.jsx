import { useEffect, useState } from "react";
import supabase from "../../services/supabaseClient";
import { ProductCard } from "../ui/ProductCard";

import '../styles/inventory.css'

export function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchInventory() {
      const { data, error } = await supabase.from("inventory").select("*");

      if (error) {
        console.error("Error fetching inventory:", error);
        setError(error.message);
      } else {
        console.log(data);
        setInventory(data); // ✅ update state with fetched data
      }
    }

    fetchInventory();
  }, []);

  return (
    <div id="inventoryContainer" >
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
       
      {inventory.length === 0 ? <h1 style={{ paddingLeft : "30vw"}}>INVENTORY EMPTY!  <em>
        create bills and watch them gets updated here :)
      </em>
      </h1> 
      
        :

      
      
      inventory.map((res) => (
        <ProductCard res={res} key={res.id || res.name} />
      ))
    }
      
    </div>
  );
}
