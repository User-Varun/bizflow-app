import "../styles/generateBillStyles/generateBill.css";

import { InvoiceFormat } from "./InvoiceFormat";
import { BillDetails } from "./BillDetails";
import { SearchItems } from "./SearchItems";
import { useBill } from "./hooks/useBill";
import { useEffect } from "react";

export function GenerateBill() {
  const { state, dispatch } = useBill();

  // When this route mounts we want the editable form to be shown by default
  // (so after a user navigates back to GenerateBill via the navbar the form is ready).
  useEffect(() => {
    dispatch({ type: "SET_FIELDS", payload: { showBill: false } });
  }, [dispatch]);

  return state.showBill ? (
    <InvoiceFormat />
  ) : (
    <section id="generateBillContainer">
      <BillDetails />
      <SearchItems />
    </section>
  );
}
