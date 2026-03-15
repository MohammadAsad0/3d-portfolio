import { useEffect, useRef } from "react";
import "./styles/WhatIDo.css";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const WhatIDo = () => {
  const containerRef = useRef<(HTMLDivElement | null)[]>([]);

  const setRef = (el: HTMLDivElement | null, index: number) => {
    containerRef.current[index] = el;
  };

  useEffect(() => {
    const items = containerRef.current.filter(
      (item): item is HTMLDivElement => Boolean(item)
    );
    const listeners = new Map<HTMLDivElement, () => void>();
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const resetState = () => {
      items.forEach((container) => {
        container.classList.remove("what-content-active", "what-sibling");
      });
    };

    const detachClickListeners = () => {
      listeners.forEach((onClick, container) => {
        container.removeEventListener("click", onClick);
      });
      listeners.clear();
    };

    const applyInteractionMode = () => {
      detachClickListeners();
      resetState();

      const useHover = hoverQuery.matches && !ScrollTrigger.isTouch;
      items.forEach((container) => {
        if (useHover) {
          container.classList.add("what-noTouch");
          return;
        }

        container.classList.remove("what-noTouch");
        const onClick = () => handleClick(container);
        listeners.set(container, onClick);
        container.addEventListener("click", onClick);
      });
    };

    applyInteractionMode();
    hoverQuery.addEventListener("change", applyInteractionMode);
    window.addEventListener("resize", applyInteractionMode);

    return () => {
      detachClickListeners();
      hoverQuery.removeEventListener("change", applyInteractionMode);
      window.removeEventListener("resize", applyInteractionMode);
    };
  }, []);
  return (
    <div className="whatIDO">
      <div className="what-box">
        <h2 className="title">
          W<span className="hat-h2">HAT</span>
          <div>
            I<span className="do-h2"> DO</span>
          </div>
        </h2>
      </div>
      <div className="what-box">
        <div className="what-box-in">
          <div className="what-border2">
            <svg width="100%">
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
              <line
                x1="100%"
                y1="0"
                x2="100%"
                y2="100%"
                stroke="white"
                strokeWidth="2"
                strokeDasharray="7,7"
              />
            </svg>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 0)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="0"
                  x2="100%"
                  y2="0"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>

            <div className="what-content-in">
              <h3>FULL-STACK ENGINEERING</h3>
              <h4>Building Reliable Production Systems</h4>
              <p>
                Designing end-to-end products from UI to backend services,
                focused on performance, maintainability, and measurable business
                outcomes.
              </p>
              <h5>Skillset & tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">Vue.js</div>
                <div className="what-tags">React.js</div>
                <div className="what-tags">Node.js</div>
                <div className="what-tags">Java REST APIs</div>
                <div className="what-tags">Microservices</div>
                <div className="what-tags">React Native</div>
                <div className="what-tags">MySQL / Db2</div>
                <div className="what-tags">MongoDB</div>
                <div className="what-tags">Git</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
          <div
            className="what-content what-noTouch"
            ref={(el) => setRef(el, 1)}
          >
            <div className="what-border1">
              <svg height="100%">
                <line
                  x1="0"
                  y1="100%"
                  x2="100%"
                  y2="100%"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>
            </div>
            <div className="what-corner"></div>
            <div className="what-content-in">
              <h3>AI / MACHINE LEARNING</h3>
              <h4>Applied ML, NLP, and Computer Vision</h4>
              <p>
                Building practical ML pipelines and research-backed prototypes
                for classification, prediction, and data-to-text generation,
                with focus on factuality and deployment readiness.
              </p>
              <h5>Skillset & tools</h5>
              <div className="what-content-flex">
                <div className="what-tags">Python</div>
                <div className="what-tags">Scikit-learn</div>
                <div className="what-tags">TensorFlow</div>
                <div className="what-tags">PyTorch</div>
                <div className="what-tags">OpenCV</div>
                <div className="what-tags">NLP</div>
                <div className="what-tags">Bayesian Networks</div>
                <div className="what-tags">Feature Engineering</div>
              </div>
              <div className="what-arrow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIDo;

function handleClick(container: HTMLDivElement) {
  container.classList.toggle("what-content-active");
  container.classList.remove("what-sibling");
  if (container.parentElement) {
    const siblings = Array.from(container.parentElement.children);

    siblings.forEach((sibling) => {
      if (sibling !== container) {
        sibling.classList.remove("what-content-active");
        sibling.classList.toggle("what-sibling");
      }
    });
  }
}
