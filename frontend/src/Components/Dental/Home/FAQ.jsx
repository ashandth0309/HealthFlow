import DentalNav from "./DentalNav";

function FAQ() {
  return (
    <div>
      <DentalNav />
      <div className="dental_home_bk_service">
        <h1 className="topic_data">FAQ</h1>
        <div className="fq_card_main">
          <div className="fq_card">
            <h3 className="fq_topic">
              Can I choose my dentist for the appointment?
            </h3>
            <p className="fq_para">
              Yes, you can select your preferred dentist from the list when
              booking your appointment.
            </p>
          </div>
          <div className="fq_card">
            <h3 className="fq_topic">
              What if I need to cancel or reschedule my appointment?
            </h3>
            <p className="fq_para">
              You can cancel or reschedule your appointment through the patient
              portal by accessing your bookings and choosing the appropriate
              option. Follow the prompts to make the necessary changes.
            </p>
          </div>
          <div className="fq_card">
            <h3 className="fq_topic">
              What should I do if my appointment is rejected?
            </h3>
            <p className="fq_para">
              If your appointment is rejected, you can either choose another
              time slot, dentist, or clinic and try booking again. Our team will
              assist you if you face any issues
            </p>
          </div>

          <div className="fq_card">
            <h3 className="fq_topic">
              What happens if I’m running late for my appointment?
            </h3>
            <p className="fq_para">
              If you’re running late, please call the clinic as soon as
              possible. We’ll do our best to accommodate you, but your
              appointment may need to be rescheduled if there is insufficient
              time to complete your treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
