import supabase from "../../services/supabaseClient";

import "../styles/generateBillStyles/billDetails.css";
import { useBill } from "./hooks/useBill";

export function BillDetails() {
  const { state, dispatch } = useBill();

  // This data Will come from user Profile in future (when user auth is implemented )
  const mamaJiDetails = {
    name: "V.S. Enterprises",
    address: "667 lig 2nd scheme no. 71",
    phoneNo: 9229665110,
  };

  function handleSubmit(e) {
    e.preventDefault();

    // if there's no items in bill, return
    if (!state.billItems.length > 0) return;

    // Auto Filling Mama ji's detail based on bill Type
    if (state.billType === "Credit") {
      dispatch({
        type: "SET_FIELDS",
        payload: {
          sellerName: mamaJiDetails.name,
          sellerAddress: mamaJiDetails.address,
          sellerPhoneNo: mamaJiDetails.phoneNo,
        },
      });
    } else if (state.billType === "Debit") {
      dispatch({
        type: "SET_FIELDS",
        payload: {
          buyerName: mamaJiDetails.name,
          buyerAddress: mamaJiDetails.address,
          buyerPhoneNo: mamaJiDetails.phoneNo,
        },
      });
    }

    handleSaveBill();
  }

  async function handleSaveBill() {
    try {
      // Save to Bill + Bill_items table in the database

      const { data: billDataRes, error: billDataError } = await supabase
        .from("bills")
        .insert([
          {
            bill_type: state.billType,
            buyer_name: state.buyerName,
            buyer_address: state.buyerAddress,
            buyer_phone_no: state.buyerPhoneNo,

            seller_name: state.sellerName,
            seller_address: state.sellerAddress,
            seller_phone_no: state.sellerPhoneNo,

            cgst: state.cgst,
            sgst: state.sgst,
          },
        ])
        .select();

      if (billDataError)
        throw "error while saving in Bill Table (Generate Bill,  line no 95)";

      console.log("SuccessFully Saved Bill", billDataRes);

      const itemsToSave = state.billItems.map((item) => {
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

      // setting input fields to their initial values.
      // dispatch({
      //   type: "SET_FIELDS",
      //   payload: {
      //     billType: "Credit",
      //     buyerName: "",
      //     buyerAddress: "",
      //     buyerPhoneNo: "",
      //     sellerName: "",
      //     sellerAddress: "",
      //     sellerPhoneNo: "",
      //     cgst: "",
      //     sgst: "",
      //     billItems: [],
      // },
      // });
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
              value={state.billType}
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELDS",
                  payload: { billType: e.target.value },
                })
              }
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
              value={
                state.billType === "Credit" ? state.buyerName : state.sellerName
              }
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELDS",
                  payload:
                    state.billType === "Credit"
                      ? { buyerName: e.target.value }
                      : { sellerName: e.target.value },
                })
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
              value={
                state.billType === "Credit"
                  ? state.buyerAddress
                  : state.sellerAddress
              }
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELDS",
                  payload:
                    state.billType === "Credit"
                      ? { buyerAddress: e.target.value }
                      : { sellerAddress: e.target.value },
                })
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
              value={
                state.billType === "Credit"
                  ? state.buyerPhoneNo
                  : state.sellerPhoneNo
              }
              onChange={(e) =>
                dispatch({
                  type: "SET_FIELDS",
                  payload:
                    state.billType === "Credit"
                      ? { buyerPhoneNo: e.target.value }
                      : { sellerPhoneNo: e.target.value },
                })
              }
            />
          </div>
        </div>

        <div id="billItemsContainer">
          {state.billItems && state.billItems.length > 0 ? (
            state.billItems.map((item) => {
              return (
                <div className="billItemCard">
                  <span>Item : {item.name}</span>
                  <span>Quantity : {item.item_qty}</span>
                  <span>Rate :{item.rate}</span>
                </div>
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
                type="text"
                placeholder="2.5"
                value={state.cgst}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELDS",
                    payload: { cgst: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <em>SGST </em>{" "}
              <input
                className="formEl2"
                required
                type="text"
                placeholder="2.5"
                value={state.sgst}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELDS",
                    payload: { sgst: e.target.value },
                  })
                }
              />
            </div>
          </div>
        </div>

        <button type="submit" className="submitBtn">
          Generate Bill
        </button>
      </form>
      <button
        className="btn-temp"
        onClick={() => {
          dispatch({
            type: "SET_FIELDS",
            payload: { showBill: !state.showBill },
          });
        }}
      >
        Show Generated Bill
      </button>
    </section>
  );
}
