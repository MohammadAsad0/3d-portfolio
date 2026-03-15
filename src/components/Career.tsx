import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full-Stack Developer (Senior IT Officer)</h4>
                <h5>Bank AL-Habib Limited</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Developed and integrated 20+ trade modules for core banking,
              delivered Vue.js interfaces, and optimized Java REST APIs with
              FSM (Node.js) integrations. Contributed to a monolith-to-
              microservices transition that reduced downtime and improved
              transaction reliability and processing speed.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Associate Software Engineer</h4>
                <h5>Encore Pay</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Implemented Stripe and Plaid SDKs in a React Native finance app
              to support secure domestic and international transactions across
              5+ countries, while improving UX through iterative product
              feedback and stakeholder collaboration.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Android Developer Intern</h4>
                <h5>Hysab Kytab - Jaffer Business System</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Implemented new Android features, fixed critical issues, and
              supported migration from Java to Kotlin to improve code quality,
              maintainability, and app stability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
