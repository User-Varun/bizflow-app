import "../styles/generateBillStyles/generateBill.css";

import { InvoiceFormat } from "./invoiceFormat";
import { BillDetails } from "./BillDetails";
import { SearchItems } from "./SearchItems";
import { useBill } from "./hooks/useBill";

export function GenerateBill() {
  const { state } = useBill();

  return state.showBill ? (
    <InvoiceFormat />
  ) : (
    <section id="generateBillContainer">
      <BillDetails />
      <SearchItems />
    </section>
  );
}
