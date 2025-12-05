import { useEffect, useState } from "react";
import supabase from "../../services/supabaseClient";

export function ViewBills() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        let query = supabase.from("bills").select("*").limit(100);
        const trimmed = searchQuery.trim();

        if (searchQuery) {
          query = query.ilike("name", `%${trimmed}%`);

          const { data: resData, error } = await query;

          if (error) {
            console.error("Supbase Error", error);
            setData([]);
            return;
          }
          setData(resData || []);
        }

        // load all bills
        const { data: allBills, error: errAllBills } = await supabase
          .from("bills")
          .select("*")
          .limit(50);

        if (errAllBills) {
          console.error(
            "Error loading all Bills ( View Bills.js ) ",
            errAllBills
          );
          setData([]);
        }
        setData(allBills || []);
      } catch (err) {
        console.error(err);
        setData([]);
      }
    }

    fetchData();
  }, [searchQuery]);

  return (
    <section id="prodCatalogContainer">
      <div id="searchBarContainer" style={{ width: "100%" }}>
        <input
          type="text"
          id="inputEl"
          placeholder="Search Products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <a className="searchBtn">🔍</a>
      </div>

      <section
        id="productCatalogContainer"
        style={{
          display: "grid",
          gridTemplateColumns: "auto auto auto auto",
        }}
      >
        {data.length > 0 ? (
          data.map((res) => {
            return (
              <div style={{ backgroundColor: "gray", padding: "2rem" }}>
                <p>{res.bill_type}</p>
              </div>
            );
          })
        ) : (
          <h1>No Bills Found!</h1>
        )}
      </section>
    </section>
  );
}
