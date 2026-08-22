import { MdEmojiEvents } from "react-icons/md";
import "./styles/Awards.css";

const AWARDS = [
  {
    title: "2nd Place — Code Bash 2023 Hackathon",
    org: "World Federation of KSIMC",
    period: "Jan 2024",
  },
  {
    title: "2nd of 23 — ITO Training Program",
    org: "Bank AL-Habib Limited",
    period: "Jan 2024",
  },
  {
    title: "Dean's List of Honors (2×)",
    org: "FAST — National University of Computer & Emerging Sciences",
    period: "Fall 2022 · Spring 2023",
  },
];

const Awards = () => {
  return (
    <div className="awards-section section-container" id="awards">
      <h3 className="title awards-title">
        Awards <span>&</span> Certifications
      </h3>
      <div className="awards-grid">
        {AWARDS.map((award) => (
          <div className="awards-card" key={award.title}>
            <div className="awards-icon">
              <MdEmojiEvents />
            </div>
            <div className="awards-body">
              <h4 className="awards-card-title">{award.title}</h4>
              <p className="awards-org">{award.org}</p>
            </div>
            <span className="awards-period">{award.period}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Awards;
