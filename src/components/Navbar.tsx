import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { createSmoother, setSmoother } from "./utils/simpleSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  useEffect(() => {
    const smoother = createSmoother();
    setSmoother(smoother);

    smoother.scrollTop(0);
    smoother.paused(true);

    const links = document.querySelectorAll(".header ul a");
    const onLinkClick = (e: Event) => {
      if (window.innerWidth > 1024) {
        e.preventDefault();
        const target = e.currentTarget as HTMLAnchorElement;
        const section = target.getAttribute("data-href");
        smoother.scrollTo(section, true);
      }
    };
    links.forEach((elem) => {
      (elem as HTMLAnchorElement).addEventListener("click", onLinkClick);
    });

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      links.forEach((elem) => {
        (elem as HTMLAnchorElement).removeEventListener("click", onLinkClick);
      });
      window.removeEventListener("resize", onResize);
      smoother?.kill();
      setSmoother(createSmoother());
    };
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          MA
        </a>
        <a
          href="mailto:ma.mohdasad@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          ma.mohdasad@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
