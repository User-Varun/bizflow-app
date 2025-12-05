import { createContext } from "react";

export const BillContext = createContext(null);

export const initialState = {
  billType: "Credit",
  sellerName: "",
  sellerAddress: "",
  sellerPhoneNo: "",
  buyerName: "",
  buyerAddress: "",
  buyerPhoneNo: "",
  cgst: "",
  sgst: "",
  billItems: [],
  showBill: false,
  isSubmitting: false,
  invoiceSnapshot: null,
};

export function reducerFn(state, action) {
  switch (action.type) {
    case "SET_FIELDS":
      return { ...state, ...action.payload };
    case "SET_SNAPSHOT":
      return { ...state, invoiceSnapshot: action.payload };
    case "UPDATE_BILL_ITEM": {
      return { ...state, billItems: action.payload.billToUpdate };
    }
    case "ADD_BILL_ITEM": {
      return { ...state, billItems: action.payload.billToUpdate };
    }
    default:
      return state;
  }
}
