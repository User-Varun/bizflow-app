import { useEffect, useState } from "react";
import "../styles/generateBill.css";
import supabase from "../../supabaseClient";

export function GenerateBill() {
  const [data, setData] = useState([]);

  const [billItems, setBillITems] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let { data: resData, error } = await supabase
        .from("product_catalog")
        .select("*");

      if (error) {
        console.error(error);
      }

      setData(resData);
    }

    fetchData();
  }, []);

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
            Bill type :{" "}
            <select style={{ backgroundColor: "grey", padding: "0.5rem" }}>
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
            ></input>
          </div>
          <div>
            <em>Sender's Business Address: </em>{" "}
            <input
              type="text"
              placeholder="type..."
              style={{ backgroundColor: "gray", color: "white" }}
            ></input>
          </div>
          <div>
            <em>Reciever's Business Name: </em>{" "}
            <input
              type="text"
              placeholder="type..."
              style={{ backgroundColor: "gray", color: "white" }}
            ></input>
          </div>

          <div>
            <em>Reciever's Business Address: </em>{" "}
            <input
              type="text"
              placeholder="type..."
              style={{ backgroundColor: "gray", color: "white" }}
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
                    item : {item.name}
                  </p>
                );
              })
            ) : (
              <p>added items will appear here</p>
            )}
          </div>
          <p></p>
          <p>Total Price : not defined</p>
          <button
            style={{ backgroundColor: "blue", padding: "1.5rem" }}
            onClick={() => {
              console.log(billItems);
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
              <input type="text" id="input" placeholder="Search Products" />
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
                return (
                  <div
                    id="card"
                    data-id={res.id}
                    onClick={(e) => {
                      e.preventDefault();

                      const el = e.target.closest("div");
                      const id = el.getAttribute("data-id");

                      if (billItems.find((item) => item.id == id)) return;

                      const ans = data.find((res) => res.id === id);

                      setBillITems([ans, ...billItems]);
                    }}
                    key={res.id || res.name}
                  >
                    <img src={`${res.img_url}`} width={100} height={100} />
                    <h1>Name : {res.name}</h1>
                    <p>Brand : {res.brand}</p>
                    <p>Quantity : {res.quantity}</p>
                    <p>Price per item: {res.price}</p>
                    <p>Total Price : {res.quantity * res.price}</p>
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
