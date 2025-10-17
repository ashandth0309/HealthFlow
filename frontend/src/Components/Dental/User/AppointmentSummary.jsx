import { useLocation } from "react-router";
import { jsPDF } from "jspdf";
import "./DentalUser.css";
import DentalNav from "../Home/DentalNav";
function AppointmentSummary() {
  const location = useLocation();
  const { appointmentData } = location.state || {};

  // Function to generate and download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Set title to be centered and bold
    doc.setFontSize(20);
    doc.text("Appointment Summary", doc.internal.pageSize.getWidth() / 2, 10, {
      align: "center",
    });

    // Draw a border rectangle around the details
    doc.setFontSize(12);
    doc.setDrawColor(0); // Black border color
    doc.rect(10, 20, doc.internal.pageSize.getWidth() - 20, 110); // x, y, width, height

    // Appointment details inside the rectangle
    let y = 30;
    doc.text(`Full Name: ${appointmentData.fullname}`, 15, y);
    y += 10;
    doc.text(`Appointment ID: ${appointmentData.appointmentID}`, 15, y);
    y += 10;
    doc.text(`Phone: ${appointmentData.phone}`, 15, y);
    y += 10;
    doc.text(`Email: ${appointmentData.email}`, 15, y);
    y += 10;
    doc.text(`Service: ${appointmentData.service}`, 15, y);
    y += 10;
    doc.text(`Clinic: ${appointmentData.clinic}`, 15, y);
    y += 10;
    doc.text(`Doctor: ${appointmentData.doctor}`, 15, y);
    y += 10;
    doc.text(`Date: ${appointmentData.date}`, 15, y);
    y += 10;
    doc.text(`Charges: Rs.${appointmentData.price}`, 15, y);
    y += 10;
    doc.text(
      `Time: ${appointmentData.timeSlotStart} To ${appointmentData.timeSlotEnd}`,
      15,
      y
    );

    // Save the PDF
    doc.save("appointment-summary.pdf");
  };

  return (
    <div>
      <div className="dental_from_background">
        <DentalNav />
        <div className="form_full_dental">
          <div className="appointment_from_full">
            <h2 className="form_head_dental">Appointment Summary</h2>
            <br />
            {appointmentData ? (
              <div className="appointment-form">
                <p className="summry_label">
                  <strong>Full Name:</strong> {appointmentData.fullname}
                </p>
                <p className="summry_label">
                  <strong>Appointment ID:</strong>{" "}
                  {appointmentData.appointmentID}
                </p>
                <p className="summry_label">
                  <strong>Phone:</strong> {appointmentData.phone}
                </p>
                <p className="summry_label">
                  <strong>Email:</strong> {appointmentData.email}
                </p>
                <p className="summry_label">
                  <strong>Service Type:</strong> {appointmentData.service}
                </p>
                <p className="summry_label">
                  <strong>Clinic:</strong> {appointmentData.clinic}
                </p>
                <p className="summry_label">
                  <strong>Doctor Name:</strong> {appointmentData.doctor}
                </p>
                <p className="summry_label">
                  <strong>Date:</strong> {appointmentData.date}
                </p>
                <p className="summry_label">
                  <strong>Time:</strong> {appointmentData.timeSlotStart}{" "}
                  <strong>To</strong> {appointmentData.timeSlotEnd}
                </p>
                <p className="summry_label">
                  <strong>Charges:</strong> Rs.{appointmentData.price}.00
                </p>
                <div className="input_group">
                  <button onClick={downloadPDF} className="submit_btn">
                    Download PDF
                  </button>
                  <button
                    className="submit_btn"
                    onClick={() => {
                      localStorage.setItem(
                        "appointmentPrice",
                        appointmentData.price
                      );
                      window.location.href = "/paynow";
                    }}
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            ) : (
              <p>No appointment data found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentSummary;
