import { useEffect, useState } from "react";

import "../styles/generateBillStyles/searchItems.css";
import supabase from "../../services/supabaseClient";
import { SearchBar } from "../ui/searchBar";
import { BillCardItem } from "../ui/BillCardItem";
import { useSearchItems } from "./hooks/useSearchItems";

export function SearchItems() {
  const { state, __dispatch__ } = useSearchItems();

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        let query = supabase.from("product_catalog").select("*").limit(100);
        const trimmed = state.searchQuery.trim();

        if (state.searchQuery) {
          query = query.ilike("name", `%${trimmed}%`);

          const { data: resData, error } = await query;

          if (error) {
            console.error("Supbase Error", error);
            setData([]);
            return;
          }
          setData(resData || []);
        }
      } catch (err) {
        console.error(err);
        setData([]);
      }
    }

    fetchData();
  }, [state.searchQuery]);

  return (
    <section id="searchFeatureContainer">
      <SearchBar />
      <div id="searchItemsContainer">
        {data.length > 0 ? (
          data.map((res) => {
            return <BillCardItem res={res} key={res.id || res.name} />;
          })
        ) : (
          <h1>No products!</h1>
        )}
      </div>
    </section>
  );
}
