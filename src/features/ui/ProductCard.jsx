export function ProductCard({ res }) {
  return (
    <div className="cardItem" key={res.id || res.name}>
      <img src={`${res.img_url}`} className="cardImg" />
      <span id="nameAndBrand">
        {res.name} by {res.brand}
      </span>

      <span>
        {res.unit_qty} {res.unit_name} at ₹{res.mrp}
      </span>
      <span>Quantity: {res.item_qty}</span>
      <span>HSN code: {res.hsn_code}</span>
    </div>
  );
}
