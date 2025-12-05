import "../styles/generateBillStyles/invFormat.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useBill } from "./hooks/useBill";

export function InvoiceFormat() {
  const { state } = useBill();
  const data = state.invoiceSnapshot || state;

  const subtotal = data.billItems?.reduce(
    (acc, item) => acc + Number(item.rate || 0) * Number(item.item_qty || 0),
    0
  );

  const cgstPct = Number(data.cgst) || 0;
  const sgstPct = Number(data.sgst) || 0;

  const cgstAmt = (subtotal * cgstPct) / 100;
  const sgstAmt = (subtotal * sgstPct) / 100;
  const grandTotal = subtotal + cgstAmt + sgstAmt;

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

  function formatAmt(n) {
    return `₹${Number(n || 0).toFixed(2)}`;
  }

  return (
    <>
      <div id="invoice-root" className="invoice-container">
        <div className="invoice-border">
          <header className="inv-top">
            <div className="inv-left">
              <h2 className="company">ANAYA ENTERPRISES {data.sellerName}</h2>
              <p>
                Building no., Plot no. 41/1, 23-Madhya Pradesh Sindhi Gali,
                Snehlataganj, Indore{data.sellerAddress}
              </p>
              <p>Phone: 8438923432{data.sellerPhoneNo}</p>
            </div>

            <div className="inv-right">
              <h2> ANAYA ENTERPRISES {data.buyerName}</h2>
              <p>
                Building no., Plot no. 41/1, 23-Madhya Pradesh Sindhi Gali,
                Snehlataganj, Indore{data.buyerAddress}
              </p>
              <p>Phone: 8438923432{data.buyerPhoneNo}</p>
              <p>GST : 34895374</p>
            </div>
          </header>

          <section className="bill-meta">
            <div>
              <strong>GSTIN:</strong> 23BSPQS1698K1ZU
            </div>
            <div className="inv-center">
              <h1 className="inv-title">GST INVOICE</h1>
            </div>
            <div>
              <strong>Sales Man:</strong>
            </div>
          </section>

          <table className="inv-table">
            <thead>
              <tr>
                <th>Sn.</th>
                <th>QTY</th>
                <th>Product</th>
                <th>HSN</th>
                <th>MRP</th>
                <th>RATE</th>
                <th>Dis1</th>
                <th>Dis2</th>
                <th>SGST</th>
                <th>CGST</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.billItems && data.billItems.length > 0 ? (
                data.billItems.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>{idx + 1}</td>
                    <td>{item.item_qty}</td>
                    <td className="prod-col">{item.name}</td>
                    <td>{item.hsn || "-"}</td>
                    <td>{item.mrp ?? "-"}</td>
                    <td>{item.rate ?? "-"}</td>
                    <td>0.00</td>
                    <td>0.00</td>
                    <td>{sgstPct}%</td>
                    <td>{cgstPct}%</td>
                    <td>
                      {formatAmt(
                        Number(item.rate || 0) * Number(item.item_qty || 0)
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} style={{ textAlign: "center" }}>
                    NO Items available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="subTotalContainer">
            <div className="inner-stc">
              <span>SUB TOTAL</span>
              <span>{formatAmt(subtotal)}</span>
            </div>
          </div>

          <div className="totals-row">
            <div className="left-block">
              <div className="inner-left-block">
                <p className="in-words">
                  Rs. five thousand three hundred thiry seven only
                  {/* {Number(grandTotal).toFixed(2)}
                   */}
                </p>
                <div className="terms">
                  <h4>Terms & Conditions</h4>
                  <p>Goods once sold will not be taken back or exchanged.</p>
                </div>
                <div className="bank">
                  <p>
                    <strong>HDFC BANK</strong> - IFSC: HDFC0006335
                  </p>
                </div>
              </div>
              <div className="inner-right-block">
                <div className="qr"></div>
                <p>Auth. Signature</p>
              </div>
            </div>
            <div className="right-block">
              <div className="tot-line">
                <span>SGST PAYABLE</span>
                <span>{formatAmt(sgstAmt)}</span>
              </div>
              <div className="tot-line">
                <span>CGST PAYABLE</span>
                <span>{formatAmt(cgstAmt)}</span>
              </div>
              <div className="tot-line">
                <span>DIS1</span>
                <span>0</span>
              </div>
              <div className="tot-line">
                <span>DIS2</span>
                <span>0</span>
              </div>
              <div className="tot-line">
                <span>TOTAL DIS</span>
                <span>0</span>
              </div>
              <div className="tot-line">
                <span>CR/DR NOTE</span>
                <span>0</span>
              </div>
              <div className="tot-line grand">
                <span>GRAND TOTAL</span>
                <span>{formatAmt(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button onClick={handleDownloadPDF} style={{ padding: "0.5rem 1rem" }}>
          Download this in PDF
        </button>
      </div>
    </>
  );
}
