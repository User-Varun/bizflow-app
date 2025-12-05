import "../styles/productCatalog.css";
import { useEffect, useState } from "react";
import supabase from "../../services/supabaseClient";
import { SearchBar } from "../ui/searchBar";
import { ProductCard } from "../ui/ProductCard";

export function ProductCatalog() {
  const [data, setData] = useState([]);
  // const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Form Data
  const [imageData, setImageData] = useState(null);
  const [imgURL, setImgURL] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [mrp, setMrp] = useState(0);
  const [hsnCode, setHsnCode] = useState("");
  const [unitName, setUnitName] = useState("");
  const [unitQty, setUnitQty] = useState(0);
  const [itemQty, setItemQty] = useState(0);

  // search query
  const [searchQuery , setSearchQuery ] = useState('')


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

    if (!imageData || !name || !brand) return alert("Please fill the data");

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
        .insert([
          {
            name,
            brand,
            img_url: publicUrl,
            mrp,
            hsn_code: hsnCode,
            unit_name: unitName,
            unit_qty: unitQty,
            item_qty: itemQty,
          },
        ])
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
    <section id="prodCatalogContainer">
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
                onChange={(e) => {
                  setMrp(e.target.value);
                }}
                placeholder="product MRP"
              />
              <input
                type="number"
                onChange={(e) => {
                  setHsnCode(e.target.value);
                }}
                placeholder="HSN Code"
              />
              <input
                type="text"
                onChange={(e) => {
                  setUnitName(e.target.value);
                }}
                placeholder="box or pcs or pkt or jar"
              />
              <input
                type="number"
                onChange={(e) => {
                  setUnitQty(e.target.value);
                }}
                placeholder="Qty of your unit in number"
              />
              <input
                type="number"
                onChange={(e) => {
                  setItemQty(e.target.value);
                }}
                placeholder="how many of those units"
              />
            </div>

            {/* Add your form fields here */}
            <button onClick={handleSubmit}>Submit</button>
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

      <div id='innerHeader' >

      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} widthInPercent={70} />
      <button className="prodCBtn" onClick={toggleForm}>+ Add Product</button>
      </div>

      <section id="productCatalogContainer">
        {data.length > 0 ? (
          data.map((res) => {
            return (
              <ProductCard  res={res} key={res.id || res.name} />
            );
          })
        ) : (
          <h1>No products!</h1>
        )}
      </section>
    </section>
  );
}
