import { useEffect, useState } from "react";
import "../styles/generateBill.css";
import supabase from "../../services/supabaseClient";

export function GenerateBill() {
  const [data, setData] = useState([]);
  const [billItems, setBillITems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState({});

  let totalPrice = 0;

  // Bill Details
  const [billDetails, setBillDetails] = useState({
    billType: "credit",
    sender: { name: "", address: "" },
    receiver: { name: "", address: "" },
  }); // bill-type , reciver : { name, address} , sender : {name , address}

  const updateBillDetail = (section, field) => (e) =>
    setBillDetails((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [field]: e.target.value },
    }));

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

  const increaseQuan = function (id) {
    return setQuantities((q) => ({ ...q, [id]: (q[id] || 0) + 1 }));
  };
  const decreaseQuan = function (id) {
    return setQuantities((q) => ({
      ...q,
      [id]: Math.max(0, (q[id] || 0) - 1),
    }));
  };

  return (
    <>
      {/* <div
        style={{
          textAlign: "center",
          fontSize: "16px",
          fontWeight: "bold",
          paddingTop: "1rem",
        }}
      >
        <h1>GenerateBill</h1>
        <p>Manage your inventory (Create Bill buy and sell ) </p>
      </div> */}
      <section id="container">
        <section id="billDetails">
          <h1
            style={{
              fontSize: "32px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Bill Details
          </h1>
          <div>
            Bill type :
            <select
              style={{ backgroundColor: "grey", padding: "0.5rem" }}
              value={billDetails.billType}
              onChange={(e) =>
                setBillDetails((prev) => ({
                  ...prev,
                  billType: e.target.value,
                }))
              }
            >
              <option>Credit</option>
              <option>Debit</option>
            </select>
          </div>

          <div>
            <em>Sender's Business Name: </em>{" "}
            <input
              type="text"
              placeholder="type..."
              style={{ backgroundColor: "gray", color: "white" }}
              value={billDetails.sender.name}
              onChange={updateBillDetail("sender", "name")}
            ></input>
          </div>
          <div>
            <em>Sender's Business Address: </em>{" "}
            <input
              type="text"
              placeholder="type..."
              style={{ backgroundColor: "gray", color: "white" }}
              value={billDetails.sender.address}
              onChange={updateBillDetail("sender", "address")}
            ></input>
          </div>
          <div>
            <em>Reciever's Business Name: </em>{" "}
            <input
              type="text"
              placeholder="type..."
              style={{ backgroundColor: "gray", color: "white" }}
              value={billDetails.receiver.name}
              onChange={updateBillDetail("receiver", "name")}
            ></input>
          </div>

          <div>
            <em>Reciever's Business Address: </em>{" "}
            <input
              type="text"
              placeholder="type..."
              style={{ backgroundColor: "gray", color: "white" }}
              value={billDetails.receiver.address}
              onChange={updateBillDetail("receiver", "address")}
            ></input>
          </div>
          <div id="billItemsContainer">
            {billItems && billItems.length > 0 ? (
              billItems.map((item) => {
                totalPrice += item.price * item.quantity * item.itemQuan;

                return (
                  <p
                    style={{ backgroundColor: "orange", padding: "1rem" }}
                    key={item.id}
                  >
                    item : {item.name}, Quantity : {item.itemQuan}
                  </p>
                );
              })
            ) : (
              <p>added items will appear here</p>
            )}
          </div>
          <p></p>
          <p>Total Price : {totalPrice}</p>
          <button
            style={{ backgroundColor: "blue", padding: "1.5rem" }}
            onClick={() => {
              console.log({ billDetails, billItems, totalPrice });
            }}
          >
            generate Bill
          </button>
        </section>

        <section
          style={{
            backgroundColor: "white",
            borderRadius: "5px",
            padding: "1.5rem",
          }}
        >
          <section id="searchAndFilter">
            <div id="search">
              <input
                type="text"
                id="input"
                placeholder="Search Products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <a
                style={{
                  backgroundColor: "gray",
                  color: "white",
                  padding: "0.3rem",
                  cursor: "pointer",
                }}
              >
                go!
              </a>
            </div>
            {/* <select id="filter">
          <option>All Categories</option>
          <option>something!</option>
          <option>something!</option>
          <option>something!</option>
        </select> */}
          </section>

          <section id="productCatalogContainer">
            {data.length > 0 ? (
              data.map((res) => {
                const currentQuan = quantities[res.id] || 0;
                return (
                  <div id="card" key={res.id || res.name}>
                    <img src={`${res.img_url}`} width={100} height={100} />
                    <h1>Name : {res.name}</h1>
                    <p>Brand : {res.brand}</p>
                    <p>Quantity : {res.quantity}</p>
                    <p>Price per item: {res.price}</p>
                    <p>Total Price : {res.quantity * res.price}</p>

                    <div style={{ display: "flex", gap: "1rem" }}>
                      <button
                        style={{ backgroundColor: "blue", padding: "0.25rem" }}
                        onClick={() => decreaseQuan(res.id)}
                      >
                        -
                      </button>
                      <p
                        style={{ backgroundColor: "black", padding: "0.25rem" }}
                      >
                        {currentQuan}
                      </p>
                      <button
                        style={{ backgroundColor: "blue", padding: "0.25rem" }}
                        onClick={() => increaseQuan(res.id)}
                      >
                        +
                      </button>
                      <div>
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
                                        itemQuan: (item.itemQuan || 0) + qty,
                                      }
                                    : item;
                                });
                              }
                              // Add new item with selected quantity
                              return [{ ...res, itemQuan: qty }, ...prev];
                            });

                            // reset the selected qty for this product only
                            setQuantities((q) => ({ ...q, [id]: 0 }));
                          }}
                        >
                          ADD
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <h1>No products!</h1>
            )}
          </section>
        </section>
      </section>
    </>
  );
}
