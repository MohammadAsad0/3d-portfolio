import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          <span className="about-accent">Full-Stack Developer</span> and{" "}
          <span className="about-accent">AI/ML Engineer</span> with a track
          record of shipping at scale — 20+ core banking trade modules at{" "}
          <span className="about-accent">Bank AL-Habib</span> using Vue.js,
          Java microservices &amp; Node.js FSMs, and a React Native fintech app
          handling cross-border payments across 5+ countries. On the AI side: Machine learning, 
          NLP, computer vision, and LLM systems built in Python — from
          automated short-answer grading to Bayesian medical diagnosis.
          Currently deepening both disciplines through {" "}
          <span className="about-accent">
            Master of Science in Computer Science (AI) at York University
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default About;
