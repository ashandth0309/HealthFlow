import HomeNav from "../Home/HomeNav";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

function MyAppoimentSummry() {
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  useEffect(() => {
    // Get appointment details from local storage
    const storedData = localStorage.getItem("appointmentDetails");
    if (storedData) {
      setAppointmentDetails(JSON.parse(storedData));
    }
  }, []);

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
    doc.text(`Full Name: ${appointmentDetails.fullname}`, 15, y);
    y += 10;
    doc.text(`Appointment ID: ${appointmentDetails.doctorAppoimentID}`, 15, y);
    y += 10;
    doc.text(`Doctor Name: ${appointmentDetails.doctorname}`, 15, y);
    y += 10;
    doc.text(`Email: ${appointmentDetails.gmail}`, 15, y);
    y += 10;
    doc.text(`Location: ${appointmentDetails.location}`, 15, y);
    y += 10;
    doc.text(`Phone: ${appointmentDetails.phone}`, 15, y);
    y += 10;
    doc.text(`Session: ${appointmentDetails.session}`, 15, y);
    y += 10;
    doc.text(`Date: ${appointmentDetails.date}`, 15, y);
    y += 10;
    doc.text(`Time: ${appointmentDetails.timeSlot}`, 15, y);
    y += 10;
    doc.text(`Charges: Rs.${appointmentDetails.price}`, 15, y);
    y += 10;

    // Save the PDF
    doc.save("appointment-summary.pdf");
  };

  return (
    <div>
      <HomeNav />
      <div className="form_full_doctor">
        <div className="appointment_from_full">
          <h2 className="form_head_app">Appointment Summary</h2>
          <br />
          {appointmentDetails ? (
            <div className="appointment-form">
              <p className="summry_label">
                <strong>Full Name:</strong> {appointmentDetails.fullname}
              </p>
              <p className="summry_label">
                <strong>Appointment ID:</strong>{" "}
                {appointmentDetails.doctorAppoimentID}
              </p>
              <p className="summry_label">
                <strong>Doctor Name:</strong> {appointmentDetails.doctorname}
              </p>
              <p className="summry_label">
                <strong>Email:</strong> {appointmentDetails.gmail}
              </p>
              <p className="summry_label">
                <strong>Location:</strong> {appointmentDetails.location}
              </p>
              <p className="summry_label">
                <strong>Phone:</strong> {appointmentDetails.phone}
              </p>
              <p className="summry_label">
                <strong>Session:</strong> {appointmentDetails.session}
              </p>
              <p className="summry_label">
                <strong>Date:</strong> {appointmentDetails.date}
              </p>
              <p className="summry_label">
                <strong>Time:</strong> {appointmentDetails.timeSlot}
              </p>
              <p className="summry_label">
                <strong>Charges:</strong> Rs.{appointmentDetails.price}.00
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
                      appointmentDetails.price
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
  );
}

export default MyAppoimentSummry;
