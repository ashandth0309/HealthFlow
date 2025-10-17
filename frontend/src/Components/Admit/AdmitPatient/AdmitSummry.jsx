/* eslint-disable no-unused-vars */
import { useLocation } from "react-router";
import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import HomeNav from "../Home/HomeNav";

function AdmitSummary() {
  const [admitID, setAdmitID] = useState("");
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const savedAdmitID = localStorage.getItem("admitID");
    if (savedAdmitID) {
      setAdmitID(savedAdmitID);
    }
    // Retrieve form data from localStorage
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);
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
    doc.rect(10, 20, doc.internal.pageSize.getWidth() - 20, 130); // x, y, width, height

    // Appointment details inside the rectangle
    let y = 30;
    doc.text(`Hospital: ${formData.hospital}`, 15, y);
    y += 10;
    doc.text(`Date: ${formData.date}`, 15, y);
    y += 10;
    doc.text(`Fullname: ${formData.fullname}`, 15, y);
    y += 10;
    doc.text(`Gender: ${formData.gender}`, 15, y);
    y += 10;
    doc.text(`Phone: ${formData.phone}`, 15, y);
    y += 10;
    doc.text(`Guardian: ${formData.guardian}`, 15, y);
    y += 10;
    doc.text(`Relationship: ${formData.relationship}`, 15, y);
    y += 10;
    doc.text(`Contact: ${formData.contact}`, 15, y);
    y += 10;
    doc.text(`BirthDay: ${formData.birth}`, 15, y);
    y += 10;
    doc.text(`medications: ${formData.medications}`, 15, y);
    y += 10;
    doc.text(`symptoms: ${formData.symptoms}`, 15, y);
    y += 10;
    doc.text(`admitID: Rs.${formData.price}.00`, 15, y);

    // Save the PDF
    doc.save("appointment-summary.pdf");
  };
  return (
    <div>
      <HomeNav />
      <div className="">
        <div className="form_full_admit">
          <div className="APP_CARD">
            <br />
            <h2 className="form_head_dental">Appointment Summary</h2>
            <br />
            {formData ? (
              <div className="appointment-form">
                <h4 className="form_head_subb">Youre Admit Id {admitID}</h4>
                <p className="summry_label">
                  <strong>Hospital:</strong> {formData.hospital}
                </p>
                <p className="summry_label">
                  <strong>Date:</strong> {formData.date}
                </p>
                <p className="summry_label">
                  <strong>Fullname:</strong> {formData.fullname}
                </p>
                <p className="summry_label">
                  <strong>Gender:</strong> {formData.gender}
                </p>
                <p className="summry_label">
                  <strong>Phone:</strong> {formData.phone}
                </p>
                <p className="summry_label">
                  <strong>BirthDay:</strong> {formData.birth}
                </p>
                <p className="summry_label">
                  <strong>Guardian:</strong> {formData.guardian}
                </p>
                <p className="summry_label">
                  <strong>Relationship:</strong> {formData.relationship}
                </p>
                <p className="summry_label">
                  <strong>Contact:</strong> {formData.contact}
                </p>
                <p className="summry_label">
                  <strong>NIC:</strong> {formData.nic}
                </p>
                <p className="summry_label">
                  <strong>Medications:</strong> {formData.medications}
                </p>
                <p className="summry_label">
                  <strong>Symptoms:</strong> {formData.symptoms}
                </p>
                <p className="summry_label">
                  <strong>Charges:</strong> Rs.{formData.price}.00
                </p>
                <div className="input_group">
                  <button onClick={downloadPDF} className="submit_btn">
                    Download PDF
                  </button>
                  <button
                    className="submit_btn"
                    onClick={() => {
                      localStorage.setItem("appointmentPrice", formData.price);
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

export default AdmitSummary;
