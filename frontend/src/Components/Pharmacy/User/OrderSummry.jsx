import HomeNav from "../Home/HomeNav";
import { jsPDF } from "jspdf";

function OrderSummary() {
  // Retrieve data from localStorage
  const savedData = JSON.parse(localStorage.getItem("formData"));
  const savedImage = localStorage.getItem("prescriptionImage");
  const downloadPDF = () => {
    // Retrieve the saved data from local storage
    const savedData = JSON.parse(localStorage.getItem("formData"));
    const savedImage = localStorage.getItem("prescriptionImage");

    const doc = new jsPDF();

    // Set title to be centered and bold
    doc.setFontSize(20);
    doc.text("Order Summary", doc.internal.pageSize.getWidth() / 2, 10, {
      align: "center",
    });

    // Draw a border rectangle around the details
    doc.setFontSize(12);
    doc.setDrawColor(0); // Black border color
    doc.rect(10, 20, doc.internal.pageSize.getWidth() - 20, 210); // Adjust height as needed

    // Order details inside the rectangle
    let y = 30;
    doc.text(`Full Name: ${savedData.fullname}`, 15, y);
    y += 10;
    doc.text(`Patient ID: ${savedData.patientID}`, 15, y);
    y += 10;
    doc.text(`Phone: ${savedData.phone}`, 15, y);
    y += 10;
    doc.text(`Email: ${savedData.gmail}`, 15, y);
    y += 10;
    doc.text(`Pharmacy Name: ${savedData.pharmacyname}`, 15, y);
    y += 10;
    doc.text(`Pharmacy ID: ${savedData.pharmacyID}`, 15, y);
    y += 10;
    doc.text(`Delivery Method: ${savedData.deliveryMethod}`, 15, y);
    y += 10;
    doc.text(`Address: ${savedData.address}`, 15, y);
    y += 10;
    doc.text(`Order ID: ${savedData.OrderID}`, 15, y);
    y += 10;

    // Check if there is a prescription image and add it to the PDF
    if (savedImage) {
      const img = new Image();
      img.src = savedImage;

      img.onload = () => {
        doc.addImage(img, "JPEG", 15, y, 100, 100); // Adjust width and height as needed
        doc.save("order-summary.pdf");
      };
    } else {
      // If there is no image, just save the PDF
      doc.save("order-summary.pdf");
    }
  };

  return (
    <div>
      <HomeNav />
      <br/>  <br/>
      <div className="form_full_pharmacy">
        <div className="pharmacy_from_full">
          <h2 className="form_head_pharmacy">Order Summary</h2>
          {savedData ? (
            <div className="appointment-form">
              <p className="summry_label">
                <strong>Full Name:</strong> {savedData.fullname}
              </p>
              <p className="summry_label">
                <strong>Patient ID:</strong> {savedData.patientID}
              </p>
              <p className="summry_label">
                <strong>Phone:</strong> {savedData.phone}
              </p>
              <p className="summry_label">
                <strong>Email:</strong> {savedData.gmail}
              </p>
              <p className="summry_label">
                <strong>Pharmacy Name:</strong> {savedData.pharmacyname}
              </p>
              <p className="summry_label">
                <strong>Pharmacy ID:</strong> {savedData.pharmacyID}
              </p>
              <p className="summry_label">
                <strong>Delivery Method:</strong> {savedData.deliveryMethod}
              </p>
              <p className="summry_label">
                <strong>Address:</strong> {savedData.address}
              </p>
              <p className="summry_label">
                <strong>Order ID:</strong> {savedData.OrderID}
              </p>

              {savedImage && (
                <div>
                  <h3 className="summry_label">Prescription Image:</h3>
                  <img
                    src={savedImage}
                    alt="Prescription"
                    style={{ maxWidth: "300px", maxHeight: "300px" }}
                  />
                </div>
              )}
              <button onClick={downloadPDF} className="submit_btn">
                Download
              </button>
            </div>
          ) : (
            <p className="summry_label">No order data found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
