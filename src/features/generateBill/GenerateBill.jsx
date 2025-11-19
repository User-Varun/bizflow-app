import { useState } from "react";
import "../styles/generateBillStyles/generateBill.css";

import { InvoiceFormat } from "./invoiceFormat";
import { BillDetails } from "./BillDetails";
import { SearchItems } from "./SearchItems";

export function GenerateBill() {
  // Bill Details
  const [billType, setBillType] = useState("Credit");

  const [sellerName, setSellerName] = useState("");
  const [sellerAddress, setSellerAddress] = useState("");
  const [sellerPhoneNo, setSellerPhoneNo] = useState("");

  const [buyerName, setBuyerName] = useState("");
  const [buyerAddress, setBuyerAddress] = useState("");
  const [buyerPhoneNo, setBuyerPhoneNo] = useState("");

  const [cgst, setCgst] = useState("");
  const [sgst, setSgst] = useState("");
  // Till here needs to be in Bill Details.jsx , but InvoiceFormat also need it so putting here, in future will put this in it's own context + reducer

  const [showBill, setShowBill] = useState(false);
  const [billItems, setBillITems] = useState([]);

  return showBill ? (
    <InvoiceFormat
      BillData={{
        billType,
        sellerName,
        sellerAddress,
        sellerPhoneNo,
        buyerName,
        buyerAddress,
        buyerPhoneNo,
        cgst,
        sgst,
        billItems,
      }}
    />
  ) : (
    <section id="container">
      <BillDetails
        setBillItems={setBillITems}
        setShowBill={setShowBill}
        billItems={billItems}
        billDetails={
          (billType,
          sellerName,
          sellerAddress,
          sellerPhoneNo,
          buyerName,
          buyerAddress,
          buyerPhoneNo,
          cgst,
          sgst,
          setBillType,
          setSellerName,
          setSellerAddress,
          setSellerPhoneNo,
          setBuyerName,
          setBuyerAddress,
          setBuyerPhoneNo,
          setCgst,
          setSgst)
        }
      />
      <SearchItems setBillItems={setBillITems} />
    </section>
  );
}
