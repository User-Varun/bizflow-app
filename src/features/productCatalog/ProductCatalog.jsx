import Button from "../ui/button";
import "../styles/productCatalog.css";
import { useEffect, useState } from "react";
import supabase from "../../services/supabaseClient";

export function ProductCatalog() {
  const [data, setData] = useState([]);
  // const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Form Data
  const [imageData, setImageData] = useState(null);
  const [imgURL, setImgURL] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    async function fetchData() {
      let { data: resData, error } = await supabase
        .from("product_catalog")
        .select("*");

      if (error) {
        // setError(error); // avoid calling commented-out setter
        console.error(error);
      }

      setData(resData);
    }

    fetchData();
  }, []);

  function toggleForm() {
    setIsOpen(!isOpen);
  }

  function handleImageChange(e) {
    setImageData(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!imageData || !name || !brand || !price || !quantity)
      return alert("Please fill the data");

    try {
      console.log("uploading started..");
      const fileName = `${Date.now()}-${imageData.name}`;

      const { data: uploadImgData, error: imgUploadError } =
        await supabase.storage.from("images").upload(fileName, imageData);

      if (imgUploadError) throw imgUploadError;

      // getPublicUrl returns different shapes depending on SDK version; handle both
      const publicUrlRes = supabase.storage
        .from("images")
        .getPublicUrl(uploadImgData.path);

      const publicUrl =
        publicUrlRes?.data?.publicUrl ||
        publicUrlRes?.publicUrl ||
        publicUrlRes?.publicURL;

      setImgURL(publicUrl);

      console.log("img, Done sucessfully!", imgURL);

      const { data: insertedRows, error: insertError } = await supabase
        .from("product_catalog")
        .insert([{ name, brand, price, quantity, img_url: publicUrl }])
        .select();

      if (insertError) throw insertError;

      console.log(
        "data uploaded in product catalog successfully",
        insertedRows
      );
    } catch (error) {
      console.error(error);
    }
  }
  return (
    // add className for CSS fallback blur when modal is open
    <section id="container">
      {isOpen && (
        <div className="modal-overlay" onClick={toggleForm}>
          <div
            className="modal-content"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h1>Add Product</h1>
            <div
              style={{ display: "flex", gap: "1rem", flexDirection: "column" }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                placeholder="product name"
              />
              <input
                type="text"
                onChange={(e) => setBrand(e.target.value)}
                placeholder="product brand"
              />
              <input
                type="number"
                onChange={(e) => setPrice(e.target.value)}
                placeholder="product price"
              />
              <input
                type="number"
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="product quantity"
              />
            </div>

            {/* Add your form fields here */}
            <Button children={"Submit"} onClick={(e) => handleSubmit(e)} />
            <button
              className="modal-close"
              onClick={toggleForm}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <section id="page-description">
        <div>
          <h1 id="heading">Product Catalog</h1>
          <p>Mange your product catalog here</p>
        </div>

        <Button onClick={toggleForm} children={"+ Add Product"} />
      </section>

      <section id="searchAndFilter">
        <div id="search">
          <a>go!</a>

          <input type="text" id="input" placeholder="Search Products" />
        </div>
        <select id="filter">
          <option>All Categories</option>
          <option>something!</option>
          <option>something!</option>
          <option>something!</option>
        </select>
      </section>

      <section id="productCatalogContainer">
        {data.length > 0 ? (
          data.map((res) => {
            return (
              <div id="card" key={res.id || res.name}>
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
  );
}
