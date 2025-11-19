import "../styles/generateBillStyles/invFormat.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export function InvoiceFormat({ BillData }) {
  const {
    sellerName,
    sellerAddress,
    sellerPhoneNo,
    buyerName,
    buyerAddress,
    buyerPhoneNo,
    billItems,
  } = BillData;

  const totalPrice = billItems?.reduce(
    (acc, item) => acc + Number(item.rate) * Number(item.item_qty),
    0
  );
  console.log(BillData);

  async function handleDownloadPDF() {
    const el = document.getElementById("invoice-root");

    if (!el) return;

    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);

    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    if (pdfHeight <= pdf.internal.pageSize.getHeight()) {
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    } else {
      // multi-page: slice canvas into page-sized chunks
      const pageHeightPx =
        (canvas.width * pdf.internal.pageSize.getHeight()) / pdfWidth;
      let remainingHeight = canvas.height;
      let position = 0;

      while (remainingHeight > 0) {
        const tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = canvas.width;
        tmpCanvas.height = Math.min(pageHeightPx, remainingHeight);
        const ctx = tmpCanvas.getContext("2d");
        ctx.drawImage(
          canvas,
          0,
          position,
          canvas.width,
          tmpCanvas.height,
          0,
          0,
          canvas.width,
          tmpCanvas.height
        );
        const tmpImg = tmpCanvas.toDataURL("image/png");
        const tmpImgProps = pdf.getImageProperties(tmpImg);
        const tmpPdfHeight =
          (tmpImgProps.height * pdfWidth) / tmpImgProps.width;
        pdf.addImage(tmpImg, "PNG", 0, 0, pdfWidth, tmpPdfHeight);

        remainingHeight -= tmpCanvas.height;
        position += tmpCanvas.height;
        if (remainingHeight > 0) pdf.addPage();
      }
    }
    pdf.save(`invoice-${Date.now()}.pdf`);
  }

  return (
    <>
      <div id="invoice-root" class="invoice-container">
        <div class="header">
          <div>
            <h1>Buyer : {buyerName}</h1>
            <p>Address : {buyerAddress} </p>
            <p>Phone: {buyerPhoneNo} </p>
          </div>
          <div>
            <h1>Seller: {sellerName}</h1>
            <p>Address : {sellerAddress}</p>
            <p>Phone: {sellerPhoneNo}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {billItems ? (
              billItems.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.item_qty}</td>
                    <td>₹{item.rate}</td>
                    <td>₹{item.item_qty * item.rate}</td>
                  </tr>
                );
              })
            ) : (
              <h1>NO Items available</h1>
            )}
          </tbody>
        </table>
        <p class="total">Grand Total: ₹{totalPrice}</p>
        <div class="footer">
          <p>Thank you for shopping with us!</p>
        </div>
      </div>

      <button onClick={handleDownloadPDF} style={{ padding: "0.5rem 1rem" }}>
        Download this in PDF
      </button>
    </>
  );
}
