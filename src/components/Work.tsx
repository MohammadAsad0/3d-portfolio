import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward, MdArrowOutward } from "react-icons/md";

const aiProjects = [
  {
    title: "Automatic Grading of Short Answers",
    category: "NLP + Deep Learning",
    tools: "Python, NLP, Sentence Embeddings, React, Flask",
    image: "/images/preview.png",
    link: "https://github.com/MohammadAsad0/FYP-ASAG",
  },
  {
    title: "Medical Diagnosis using Bayesian Network",
    category: "Machine Learning",
    tools: "Python, Bayesian Networks, Logistic Regression, XGBoost",
    image: "/images/placeholder.webp",
    link: "https://github.com/MohammadAsad0/Medical-Diagnosis-Risk-Scoring-using-Bayesian-Networks",
  },
  {
    title: "Natural Language Generation for Data-to-Text",
    category: "LLMs + NLP",
    tools: "Python, LLMs, Prompt Engineering, Summarization, Hallucination Reduction",
    image: "/images/placeholder.webp",
    link: "https://github.com/MohammadAsad0/Final-Data-Mining-Project",
  },
  {
    title: "TTC-PULSE: Transit Ridership Analytics",
    category: "Data Analytics + Visualization",
    tools: "Python, Jupyter, Pandas, EDA, Large-scale Open Datasets",
    image: "/images/placeholder.webp",
    link: "https://github.com/MohammadAsad0/TTC-PULSE",
  },
  {
    title: "Vehicle Counting & Classification",
    category: "Computer Vision",
    tools: "Python, OpenCV, ROI Tracking, Classification",
    image: "/images/placeholder.webp",
  },
];

const devProjects = [
  {
    title: "Al-Habib Core Banking Trade Modules",
    category: "Enterprise Banking Platform",
    tools: "Vue.js, Java REST APIs, Node.js FSM, Microservices",
    image: "/images/work/ahbs.png",
  },
  {
    title: "Cross-Border Finance App",
    category: "Fintech Mobile Application",
    tools: "React Native, Stripe SDK, Plaid SDK",
    image: "/images/radix.png",
  },
  {
    title: "Encrypted QR Vault",
    category: "Secure Web Application",
    tools: "MERN Stack, Authentication, QR-based File Sharing",
    image: "/images/placeholder.webp",
    link: "https://github.com/MohammadAsad0/EncryptedVault",
  },
  {
    title: "Media Player",
    category: "Android Application",
    tools: "Java, Firebase, Android",
    image: "/images/sapphire.png",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSwitchingStack, setIsSwitchingStack] = useState(false);
  const [activeStack, setActiveStack] = useState<"dev" | "ai">("dev");

  const projects = activeStack === "dev" ? devProjects : aiProjects;

  const switchStack = useCallback(
    (stack: "dev" | "ai") => {
      if (stack === activeStack) return;
      setIsAnimating(false);
      setIsSwitchingStack(true);
      setActiveStack(stack);
      setCurrentIndex(0);
      setTimeout(() => setIsSwitchingStack(false), 80);
    },
    [activeStack]
  );

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      const normalizedIndex =
        (index + projects.length) % projects.length;
      setIsAnimating(true);
      setCurrentIndex(normalizedIndex);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating, projects.length]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide, projects.length]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide, projects.length]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <div className="work-header-row">
          <h2>
            My <span>Work</span>
          </h2>
          <div className="work-toggle" role="tablist" aria-label="Project stack switch">
            <button
              type="button"
              className={`work-toggle-btn ${activeStack === "dev" ? "work-toggle-btn-active" : ""}`}
              onClick={() => switchStack("dev")}
              role="tab"
              aria-selected={activeStack === "dev"}
              data-cursor="disable"
            >
              Dev
            </button>
            <button
              type="button"
              className={`work-toggle-btn ${activeStack === "ai" ? "work-toggle-btn-active" : ""}`}
              onClick={() => switchStack("ai")}
              role="tab"
              aria-selected={activeStack === "ai"}
              data-cursor="disable"
            >
              AI/ML
            </button>
          </div>
        </div>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              key={activeStack}
              className={`carousel-track ${isSwitchingStack ? "carousel-track-no-transition" : ""}`}
              style={{
                width: `${projects.length * 100}%`,
                transform: `translate3d(-${(currentIndex * 100) / projects.length}%, 0, 0)`,
              }}
            >
              {projects.map((project, index) => (
                <div
                  className="carousel-slide"
                  key={`${activeStack}-${index}`}
                  style={{ width: `${100 / projects.length}%` }}
                >
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <h4>{project.title}</h4>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="carousel-github-link"
                            data-cursor="disable"
                          >
                            View on GitHub <MdArrowOutward />
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage image={project.image} alt={project.title} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
