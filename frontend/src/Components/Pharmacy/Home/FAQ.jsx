import HomeNav from "./HomeNav";

function FAQ() {
  return (
    <div>
      <HomeNav />
      <div className="pharmacy_home_bk_service">
        <h1 className="topic_data">FAQ</h1>
        <div className="fq_card_main">
          <div className="fq_card">
            <h3 className="fq_topic">
              1.How do I place an order for my prescription medication?
            </h3>
            <p className="fq_para">
              You can order your prescription medication through our website.
              Simply upload a photo of your prescription
            </p>
          </div>
          <div className="fq_card">
            <h3 className="fq_topic">2.Can I talk with a pharmacist online?</h3>
            <p className="fq_para">
              Yes, our platform allows you to chat with a qualified pharmacist
              online for any questions or guidance regarding your medications.
            </p>
          </div>
          <div className="fq_card">
            <h3 className="fq_topic">3.What payment options are available?</h3>
            <p className="fq_para">
              We accept multiple payment methods, including eZ Cash, Genie,
              Amex, Visa, and MasterCard. You can also add payments to your
              mobile bill if you re using a supported mobile operator.
            </p>
          </div>

          <div className="fq_card">
            <h3 className="fq_topic">4.Can I return or exchange medication?</h3>
            <p className="fq_para">
              For safety reasons, we cannot accept returns or exchanges on
              medications once they have been delivered. However, if there is an
              issue with your order, please contact our customer support for
              assistance.
            </p>
          </div>

          <div className="fq_card">
            <h3 className="fq_topic">5.How do I contact customer support?</h3>
            <p className="fq_para">
              You can reach our customer support team via phone, email, or live
              chat on our website and app for any assistance you need.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
