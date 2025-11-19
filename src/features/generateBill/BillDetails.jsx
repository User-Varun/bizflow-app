import supabase from "../../services/supabaseClient";

import "../styles/generateBillStyles/billDetails.css";

export function BillDetails({
  setShowBill,
  billItems,
  setBillItems,
  billDetails,
}) {
  const {
    billType,
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
    setSgst,
  } = billDetails;

  // This data Will co
  // me from user Profile in future (when user auth is implemented )
  const mamaJiDetails = {
    name: "V.S. Enterprises",
    address: "667 lig 2nd scheme no. 71",
    phoneNo: 9229665110,
  };

  function handleSubmit(e) {
    e.preventDefault();

    // if there's no items in bill, return
    if (!billItems.length > 0) return;

    // Auto Filling Mama ji's detail based on bill Type

    // Calculating the current value to avoid Stale State
    const form = e.currentTarget;
    const currentBillType = form.billType.value;

    let finalBuyerName = buyerName;
    let finalBuyerAddress = buyerAddress;
    let finalBuyerPhoneNo = buyerPhoneNo;

    let finalSellerName = sellerName;
    let finalSellerAddress = sellerAddress;
    let finalSellerPhoneNo = sellerPhoneNo;

    if (currentBillType === "Credit") {
      finalSellerName = mamaJiDetails.name;
      finalSellerAddress = mamaJiDetails.address;
      finalSellerPhoneNo = mamaJiDetails.phoneNo;
    } else {
      finalBuyerName = mamaJiDetails.name;
      finalBuyerAddress = mamaJiDetails.address;
      finalBuyerPhoneNo = mamaJiDetails.phoneNo;
    }

    // update state so the UI reflects the chosen values
    setSellerName(finalSellerName);
    setSellerAddress(finalSellerAddress);
    setSellerPhoneNo(finalSellerPhoneNo);
    setBuyerName(finalBuyerName);
    setBuyerAddress(finalBuyerAddress);
    setBuyerPhoneNo(finalBuyerPhoneNo);

    // passing down the updated calculated value
    handleSaveBill({
      billType: currentBillType,
      sellerName: finalSellerName,
      sellerAddress: finalSellerAddress,
      sellerPhoneNo: finalSellerPhoneNo,
      buyerName: finalBuyerName,
      buyerAddress: finalBuyerAddress,
      buyerPhoneNo: finalBuyerPhoneNo,
    }); // to Bill + Bill items table in the backend
  }

  async function handleSaveBill({
    billType,
    sellerName,
    sellerAddress,
    sellerPhoneNo,
    buyerName,
    buyerAddress,
    buyerPhoneNo,
  }) {
    try {
      // Save to Bill + Bill_items table in the database

      const { data: billDataRes, error: billDataError } = await supabase
        .from("bills")
        .insert([
          {
            bill_type: billType,
            buyer_name: buyerName,
            buyer_address: buyerAddress,
            buyer_phone_no: buyerPhoneNo,

            seller_name: sellerName,
            seller_address: sellerAddress,
            seller_phone_no: sellerPhoneNo,

            cgst,
            sgst,
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

      // setting input fields to their initail values.
      setBillType("Credit");
      setBuyerName("");
      setBuyerAddress("");
      setBuyerPhoneNo("");
      setSellerName("");
      setSellerAddress("");
      setSellerPhoneNo("");
      setSgst("");
      setCgst("");
      setBillItems([]);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <section id="billDetails">
      <h1>Bill Details</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-sub-container">
          <div className="form-el-container">
            <span>Bill Type</span>
            <select
              className="formEl"
              style={{}}
              value={billType}
              onChange={(e) => setBillType(e.target.value)}
              name="billType"
            >
              <option className="optionEl" value="Credit">
                Credit
              </option>
              <option className="optionEl" value="Debit">
                Debit
              </option>
            </select>
          </div>

          <div className="form-el-container">
            <span>Party Name</span>
            <input
              className="formEl"
              required
              type="text"
              placeholder="e.g. arihant enterprises"
              value={billType === "Credit" ? buyerName : sellerName}
              onChange={(e) =>
                billType === "Credit"
                  ? setBuyerName(e.target.value)
                  : setSellerName(e.target.value)
              }
            />
          </div>
        </div>

        <div className="form-sub-container">
          <div className="form-el-container">
            <span>Party Address</span>
            <input
              className="formEl"
              required
              type="text"
              placeholder="e.g near navlakha road, indore"
              value={billType === "Credit" ? buyerAddress : sellerAddress}
              onChange={(e) =>
                billType === "Credit"
                  ? setBuyerAddress(e.target.value)
                  : setSellerAddress(e.target.value)
              }
            />
          </div>

          <div className="form-el-container">
            <span>Party Phone No.</span>
            <input
              className="formEl"
              required
              type="number"
              placeholder="e.g. XXXXX98260"
              maxLength={10}
              value={billType === "Credit" ? buyerPhoneNo : sellerPhoneNo}
              onChange={(e) =>
                billType === "Credit"
                  ? setBuyerPhoneNo(e.target.value)
                  : setSellerPhoneNo(e.target.value)
              }
            />
          </div>
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
            <span className="emptyContainerMsg">
              No Items! <br></br>Add some and watch them appear here 🙃
            </span>
          )}
        </div>
        <div className="form-sub-container">
          <p>Your Total : 💵</p>
          <div className="form-sub-container2">
            <div>
              <em>CGST </em>{" "}
              <input
                className="formEl2"
                required
                type="number"
                placeholder="2.5"
                value={cgst}
                onChange={(e) => setCgst(e.target.value)}
              />
            </div>
            <div>
              <em>SGST </em>{" "}
              <input
                className="formEl2"
                required
                type="number"
                placeholder="2.5"
                value={sgst}
                onChange={(e) => setSgst(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="submitBtn">
          Generate Bill
        </button>
      </form>
      <button className="btn-temp" onClick={() => setShowBill((prev) => !prev)}>
        Show Generated Bill
      </button>
    </section>
  );
}
