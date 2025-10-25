import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";

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
    <div>
      <h1>Inventory</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <ul>
        {inventory.map((item) => (
          <li key={item.id}>
            {item.name} — {item.qty}
            <p>{item.price_per_unit}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
