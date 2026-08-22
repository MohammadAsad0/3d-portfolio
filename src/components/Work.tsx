import { useState, useCallback, useRef } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward, MdArrowOutward } from "react-icons/md";

type Project = {
  title: string;
  category: string;
  tools: string;
  image: string;
  summary?: string;
  link?: string;
  ctaLabel?: string;
};

const aiProjects: Project[] = [
  {
    title: "Automatic Grading of Short Answers",
    category: "NLP + Deep Learning",
    tools: "Python, NLP, Sentence Embeddings, React, Flask",
    image: "/images/work/asag.png",
    summary:
      "Built an end-to-end grading assistant that evaluates short student answers against rubric-aligned reference responses. The system combines semantic similarity with supervised scoring models to improve grading consistency and reduce manual review time.",
    link: "https://github.com/MohammadAsad0/FYP-ASAG",
  },
  {
    title: "Medical Diagnosis using Bayesian Network",
    category: "Machine Learning",
    tools: "Python, Bayesian Networks, Logistic Regression, XGBoost",
    image: "/images/work/medical_diagnosis.png",
    summary:
      "Developed a probabilistic risk scoring pipeline for clinical features and symptoms. Compared Bayesian inference with baseline classifiers and designed interpretable outputs that help explain risk drivers instead of only returning a black-box score.",
    link: "https://github.com/MohammadAsad0/Medical-Diagnosis-Risk-Scoring-using-Bayesian-Networks",
  },
  {
    title: "Natural Language Generation for Data-to-Text",
    category: "LLMs + NLP",
    tools: "Python, LLMs, Prompt Engineering, Summarization, Hallucination Reduction",
    image: "/images/work/nlg.png",
    summary:
      "Designed prompts and evaluation routines that convert structured datasets into readable narratives. The workflow emphasizes factual grounding and post-generation checks to reduce hallucinations and improve reliability for analytical reporting.",
    link: "https://github.com/MohammadAsad0/Final-Data-Mining-Project",
  },
  {
    title: "TTC-PULSE: Transit Ridership Analytics",
    category: "Data Analytics + Visualization",
    tools: "Python, Jupyter, Pandas, EDA, Large-scale Open Datasets",
    image: "/images/placeholder.webp",
    summary:
      "Analyzed open transit data to identify demand patterns by route, day, and season. Produced reproducible notebooks and visual summaries to support service planning and communicate trends to non-technical stakeholders.",
    link: "https://github.com/MohammadAsad0/TTC-PULSE",
  },
  {
    title: "Vehicle Counting & Classification",
    category: "Computer Vision",
    tools: "Python, OpenCV, ROI Tracking, Classification",
    image: "/images/work/vehicle_counting.png",
    summary:
      "Implemented lane-level counting and class estimation using frame differencing, ROI constraints, and object tracking heuristics. Optimized the pipeline for stable counting under varying traffic density and camera perspectives.",
  },
];

const devProjects: Project[] = [
  {
    title: "ShiaStream",
    category: "Streaming Web Application",
    tools: "React, Next.js, Node.js, Vercel, Responsive UI",
    image: "/images/work/shiastream.png",
    summary:
      "Built a production streaming platform focused on fast content discovery, responsive playback surfaces, and clean cross-device UX. The deployment pipeline uses Vercel for rapid releases and consistent performance in production.",
    link: "https://shiastream.com",
    ctaLabel: "View on Web",
  },
  {
    title: "Al-Habib Core Banking Trade Modules",
    category: "Enterprise Banking Platform",
    tools: "Vue.js, Java REST APIs, Node.js FSM, Microservices",
    image: "/images/work/ahbs.png",
    summary:
      "Delivered and maintained trade workflow modules for an enterprise banking stack. Implemented front-end flows and service integrations across microservices while preserving strict business rules and transaction integrity.",
  },
  {
    title: "Finance App (Metal)",
    category: "Fintech Mobile Application",
    tools: "React Native, React.js, Stripe SDK, Plaid SDK",
    image: "/images/work/metal.png",
    summary:
      "Contributed to a cross-border fintech experience with payments and account-linking flows. Integrated third-party financial APIs and improved the reliability of critical onboarding and transaction interactions.",
  },
  {
    title: "Encrypted QR Vault",
    category: "Secure Web Application",
    tools: "MERN Stack (MongoDB, Express.js, React.js, Node.js), Authentication, QR-based File Sharing",
    image: "/images/work/vault.png",
    summary:
      "Created a secure document-sharing system where access is gated through authentication and QR-based retrieval. Focused on encryption-aware storage flow design and practical usability for non-technical users.",
    link: "https://github.com/MohammadAsad0/EncryptedVault",
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

  // Touch / swipe support
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const SWIPE_THRESHOLD = 40;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only treat as a horizontal swipe when it is more horizontal than vertical
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) goToNext();
    else goToPrev();
  };

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
          <div
            className="carousel-track-container"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
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
                        {project.summary && (
                          <p className="carousel-summary">{project.summary}</p>
                        )}
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
                            {project.ctaLabel ?? "View on GitHub"} <MdArrowOutward />
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
