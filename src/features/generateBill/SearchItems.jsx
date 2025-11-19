import { useEffect, useState } from "react";
import supabase from "../../services/supabaseClient";
import "../styles/generateBillStyles/searchItems.css";

export function SearchItems({ setBillITems }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState({});
  const [rate, setRate] = useState({});
  const [data, setData] = useState([]);

  const increaseQuan = function (id) {
    return setQuantities((q) => ({ ...q, [id]: (q[id] || 0) + 1 }));
  };
  const decreaseQuan = function (id) {
    return setQuantities((q) => ({
      ...q,
      [id]: Math.max(0, (q[id] || 0) - 1),
    }));
  };

  function handleChangeRate(id, e) {
    return setRate((q) => ({ ...q, [id]: e.target.value }));
  }

  useEffect(() => {
    async function fetchData() {
      try {
        let query = supabase.from("product_catalog").select("*").limit(100);
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
      } catch (err) {
        console.error(err);
        setData([]);
      }
    }

    fetchData();
  }, [searchQuery]);

  return (
    <section id="searchFeatureContainer">
      <div id="searchBarContainer">
        <input
          type="text"
          id="inputEl"
          placeholder="Search Products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <a className="searchBtn">🔍</a>
      </div>

      <div id="searchItemsContainer">
        {data.length > 0 ? (
          data.map((res) => {
            const currentQuan = quantities[res.id] || 0;
            return (
              <div className="cardItem" key={res.id || res.name}>
                <img src={`${res.img_url}`} width={100} height={100} />
                <h1>Name : {res.name}</h1>
                <p>Brand : {res.brand}</p>
                <p>
                  Quantity : {res.unit_qty} {res.unit_name}
                </p>
                <p>Total MRP: {res.mrp * res.item_qty}</p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2rem",
                  }}
                >
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                      style={{
                        backgroundColor: "blue",
                        padding: "0.25rem",
                      }}
                      onClick={() => decreaseQuan(res.id)}
                    >
                      -
                    </button>
                    <p
                      style={{
                        backgroundColor: "black",
                        padding: "0.25rem",
                      }}
                    >
                      {currentQuan}
                    </p>
                    <button
                      style={{
                        backgroundColor: "blue",
                        padding: "0.25rem",
                      }}
                      onClick={() => increaseQuan(res.id)}
                    >
                      +
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <p>Rate:- </p>
                    <input
                      type="number"
                      placeholder="360"
                      value={rate[res.id] ?? ""}
                      onChange={(e) => handleChangeRate(res.id, e)}
                      style={{ width: "5rem", border: "1px solid white" }}
                    />
                  </div>

                  <button
                    data-id={res.id}
                    style={{
                      backgroundColor: "blue",
                      padding: "0.25rem",
                    }}
                    onClick={(e) => {
                      e.preventDefault();

                      const id = res.id;
                      const qty = quantities[id] || 0;

                      if (qty <= 0) return; // nothing to add

                      setBillITems((prev) => {
                        const exits = prev.find((item) => item.id == id);

                        if (exits) {
                          // update existing item's property
                          return prev.map((item) => {
                            return item.id == id
                              ? {
                                  ...item,
                                  item_qty: (item.item_qty || 0) + qty,
                                  rate: Number(rate[res.id]),
                                }
                              : item;
                          });
                        }
                        // Add new item with selected quantity
                        return [
                          {
                            ...res,
                            item_qty: qty,
                            rate: Number(rate[res.id]),
                          },
                          ...prev,
                        ];
                      });

                      // reset the selected qty for this product only
                      setQuantities((q) => ({ ...q, [id]: 0 }));
                      setRate((q) => ({ ...q, [id]: "" }));
                    }}
                  >
                    ADD
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <h1>No products!</h1>
        )}
      </div>
    </section>
  );
}
