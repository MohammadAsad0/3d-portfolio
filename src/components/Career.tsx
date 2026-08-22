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
                <h4>Full Stack Developer</h4>
                <h5>Invision Custom Solutions Inc.</h5>
              </div>
              <h3>Feb 2026 — Present</h3>
            </div>
            <p>
              Building production features for a cross-platform e-commerce app
              with React and TypeScript over REST services on PostgreSQL. Owned
              a fitness application end to end — from design handoff through
              release for 1,000+ active users — driving sprint planning and
              delivery reviews with a 3-person team.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Senior IT Officer (Software Engineer)</h4>
                <h5>Bank AL-Habib Limited</h5>
              </div>
              <h3>Oct 2023 — Aug 2025</h3>
            </div>
            <p>
              Built and integrated 20 trade finance modules into an enterprise
              banking application used across 1,200 branches, using Vue.js, Java
              REST APIs, and a Node.js finite-state-machine layer. Co-led the
              team's migration from a monolith to microservices — eliminating a
              single point of failure and cutting domestic transaction
              processing time by 25%.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Associate Software Engineer</h4>
                <h5>Encore Pay</h5>
              </div>
              <h3>Jun 2023 — Sep 2023</h3>
            </div>
            <p>
              Integrated Stripe and Plaid SDKs into a React Native finance app,
              enabling domestic and international transfers with records
              persisted to SQL. Served as interim team lead — running
              requirement gathering, daily updates, and demos with the product
              owner across 2 release cycles.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Android Developer Intern</h4>
                <h5>Hysab Kytab - Jaffer Business System</h5>
              </div>
              <h3>Feb 2023 — May 2023</h3>
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
