import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              Muhammad
              <br />
              <span>Asad</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3 className="landing-info-subtitle">
              <div className="landing-h3-1">A Full Stack</div>
              <div className="landing-h3-2">AI/ Machine Learning</div>
            </h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Developer</div>
              <div className="landing-h2-2">Intern</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
