import { useEffect, useState } from "react";
import "../styles/generateBill.css";
import supabase from "../../services/supabaseClient";
import { InvoiceFormat } from "./invoiceFormat";

export function GenerateBill() {
  const [showBill, setShowBill] = useState(false);

  const [data, setData] = useState([]);
  const [billItems, setBillITems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [quantities, setQuantities] = useState({});
  const [rate, setRate] = useState({});

  // Bill Details
  const [billDetails, setBillDetails] = useState({
    billType: "credit",
    seller: { name: "", address: "", phoneNo: "" },
    buyer: { name: "", address: "", phoneNo: "" },
    cgst: "",
    sgst: "",
  });

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

  function handleChangeRate(id, e) {
    return setRate((q) => ({ ...q, [id]: e.target.value }));
  }

  async function handleSaveBill() {
    try {
      // Save to Bill + Bill_items table in the database

      const { data: billDataRes, error: billDataError } = await supabase
        .from("bills")
        .insert([
          {
            created_at: new Date().toISOString(),
            bill_type: billDetails.billType,
            buyer_name: billDetails.buyer.name,
            buyer_address: billDetails.buyer.address,
            buyer_phone_no: billDetails.buyer.phoneNo,

            seller_name: billDetails.seller.name,
            seller_address: billDetails.seller.address,
            seller_phone_no: billDetails.seller.phoneNo,

            cgst: billDetails.cgst,
            sgst: billDetails.sgst,
          },
        ])
        .select();

      if (billDataError)
        throw "error while saving in Bill Table (Generate Bill,  line no 95 ";

      console.log("SuccessFully Saved Bill", billDataRes);

      const itemsToSave = billItems.map((item) => {
        console.log(item);
        return {
          bill_id: billDataRes[0].id,
          name: item.name,
          brand: item.brand,
          hsn_code: item.hsn_code,
          unit_name: item.unit_name,
          unit_qty: item.unit_qty,
          item_qty: item.item_qty,
          rate: item.rate,
          mrp: item.mrp,
          taxable_amount: item.rate * item.item_qty,
          img_url: item.img_url,
        };
      });

      console.log(itemsToSave);

      const { data: billItemsData, error: BillItemsError } = await supabase
        .from("bill_items")
        .insert(itemsToSave)
        .select();

      console.log(billItemsData, BillItemsError);

      if (BillItemsError)
        throw "Error while Saving in  Bill items Table, generateBill.jsx at line no 105 ";

      console.log("SuccessFully Saved Bill items ", billItemsData);
    } catch (err) {
      console.error(err);
    }
  }

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
      {showBill ? (
        <InvoiceFormat BillData={{ billDetails, billItems }} />
      ) : (
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
              <em>seller's Business Name: </em>{" "}
              <input
                type="text"
                placeholder="type..."
                style={{ backgroundColor: "gray", color: "white" }}
                value={billDetails.seller.name}
                onChange={updateBillDetail("seller", "name")}
              ></input>
            </div>
            <div>
              <em>Seller's Business Address: </em>{" "}
              <input
                type="text"
                placeholder="type..."
                style={{ backgroundColor: "gray", color: "white" }}
                value={billDetails.seller.address}
                onChange={updateBillDetail("seller", "address")}
              ></input>
            </div>
            <div>
              <em>seller's Business Phone Number: </em>{" "}
              <input
                type="number"
                placeholder="81202XXXXX"
                maxLength={10}
                max={10}
                pattern="\d{10}"
                style={{ backgroundColor: "gray", color: "white" }}
                value={billDetails.seller.phoneNo}
                onChange={updateBillDetail("seller", "phoneNo")}
              ></input>
            </div>
            <div>
              <em>Buyer's Business Name: </em>{" "}
              <input
                type="text"
                placeholder="type..."
                style={{ backgroundColor: "gray", color: "white" }}
                value={billDetails.buyer.name}
                onChange={updateBillDetail("buyer", "name")}
              ></input>
            </div>
            <div>
              <em>Buyer's Business Address: </em>{" "}
              <input
                type="text"
                placeholder="type..."
                style={{ backgroundColor: "gray", color: "white" }}
                value={billDetails.buyer.address}
                onChange={updateBillDetail("buyer", "address")}
              ></input>
            </div>

            <div>
              <em>Reciever's Business Phone Number: </em>{" "}
              <input
                type="number"
                placeholder="81202XXXXX"
                maxLength={10}
                style={{ backgroundColor: "gray", color: "white" }}
                value={billDetails.buyer.phoneNo}
                onChange={updateBillDetail("buyer", "phoneNo")}
              ></input>
            </div>

            <div>
              <em>CGST (in % ):- </em>{" "}
              <input
                type="number"
                placeholder="2.5"
                style={{ backgroundColor: "gray", color: "white" }}
                value={billDetails.cgst}
                onChange={(e) =>
                  setBillDetails((prev) => ({
                    ...prev,
                    cgst: e.target.value,
                  }))
                }
              ></input>
            </div>
            <div>
              <em>SGST (in % ):- </em>{" "}
              <input
                type="number"
                placeholder="2.5"
                style={{ backgroundColor: "gray", color: "white" }}
                value={billDetails.sgst}
                onChange={(e) =>
                  setBillDetails((prev) => ({
                    ...prev,
                    sgst: e.target.value,
                  }))
                }
              ></input>
            </div>
            <div id="billItemsContainer">
              {billItems && billItems.length > 0 ? (
                billItems.map((item) => {
                  return (
                    <p
                      style={{ backgroundColor: "orange", padding: "1rem" }}
                      key={item.id}
                    >
                      item : {item.name}, Quantity : {item.item_qty} , Rate :{" "}
                      {item.rate}
                    </p>
                  );
                })
              ) : (
                <p>added items will appear here</p>
              )}
            </div>
            <p></p>

            <button
              style={{ backgroundColor: "blue", padding: "1.5rem" }}
              onClick={() => {
                console.log({ billDetails, billItems });

                handleSaveBill(); // to Bill + Bill items table in the backend
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
            </section>
          </section>

          <button onClick={() => setShowBill((prev) => !prev)}>
            Show Generated Bill
          </button>
        </section>
      )}
    </>
  );
}
