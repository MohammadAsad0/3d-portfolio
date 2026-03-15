import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { SiDatacamp, SiHuggingface, SiKaggle } from "react-icons/si";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect } from "react";
import HoverLinks from "./HoverLinks";

const DEV_RESUME_URL = "/resumes/dev-resume.pdf";
const AI_RESUME_URL = "/resumes/ai-resume.pdf";

const SocialIcons = () => {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const social = document.getElementById("social") as HTMLElement;
    if (!social) return;

    const cleanups: Array<() => void> = [];

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;
      if (!link) return;

      const rect = () => elem.getBoundingClientRect();
      let mouseX = rect().width / 2;
      let mouseY = rect().height / 2;
      let currentX = 0;
      let currentY = 0;
      let frame = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        frame = requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const bounds = rect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = bounds.width / 2;
          mouseY = bounds.height / 2;
        }
      };

      const onLeave = () => {
        const bounds = rect();
        mouseX = bounds.width / 2;
        mouseY = bounds.height / 2;
      };

      elem.addEventListener("mousemove", onMouseMove);
      elem.addEventListener("mouseleave", onLeave);

      updatePosition();

      cleanups.push(() => {
        cancelAnimationFrame(frame);
        elem.removeEventListener("mousemove", onMouseMove);
        elem.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a
            href="https://www.github.com/MohammadAsad0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub />
          </a>
        </span>
        <span>
          <a
            href="https://www.linkedin.com/in/mohammadasad0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn />
          </a>
        </span>
        <span>
          <a
            href="https://www.datacamp.com/portfolio/mohammadasad"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiDatacamp />
          </a>
        </span>
        <span>
          <a
            href="https://www.huggingface.co/mohammadasad"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiHuggingface />
          </a>
        </span>
        <span>
          <a
            href="https://www.kaggle.com/mohdasad0"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiKaggle />
          </a>
        </span>
      </div>
      <div className="resume-switch">
        <a
          className="resume-button resume-button-dev"
          href={DEV_RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <HoverLinks text="DEV RESUME" />
          <span>
            <TbNotes />
          </span>
        </a>
        <a
          className="resume-button resume-button-ai"
          href={AI_RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <HoverLinks text="AI RESUME" />
          <span>
            <TbNotes />
          </span>
        </a>
      </div>
    </div>
  );
};

export default SocialIcons;
