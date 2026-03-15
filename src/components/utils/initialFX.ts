import { SplitText } from "gsap-trial/SplitText";
import gsap from "gsap";
import { smoother } from "../Navbar";

let splitInstances: SplitText[] = [];
let loopTimelines: gsap.core.Timeline[] = [];

function resetInitialFXState() {
  loopTimelines.forEach((timeline) => timeline.kill());
  loopTimelines = [];

  splitInstances.forEach((instance) => instance.revert());
  splitInstances = [];
}

function createSplitText(target: string | string[], config: object) {
  const instance = new SplitText(target, config);
  splitInstances.push(instance);
  return instance;
}

export function initialFX() {
  resetInitialFXState();

  document.body.style.overflowY = "auto";
  smoother.paused(false);
  document.getElementsByTagName("main")[0].classList.add("main-active");
  gsap.to("body", {
    backgroundColor: "#0a0e17",
    duration: 0.5,
    delay: 1,
  });

  const landingText = createSplitText(
    [".landing-intro h2", ".landing-intro h1"],
    {
      type: "chars,lines",
      linesClass: "split-line",
    }
  );
  gsap.fromTo(
    landingText.chars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.025,
      delay: 0.3,
    }
  );

  const textProps = { type: "chars,lines", linesClass: "split-h2" };
  const rolePrimary = createSplitText(".landing-h2-1", textProps);
  const roleSecondary = createSplitText(".landing-h2-2", textProps);
  const subtitlePrimary = createSplitText(".landing-h3-1", textProps);
  const subtitleSecondary = createSplitText(".landing-h3-2", textProps);

  const primaryChars = [...rolePrimary.chars, ...subtitlePrimary.chars];
  const secondaryChars = [...roleSecondary.chars, ...subtitleSecondary.chars];

  gsap.fromTo(
    primaryChars,
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      stagger: 0.03,
      delay: 0.3,
    }
  );

  gsap.fromTo(
    [".resume-button-dev"],
    { opacity: 0, y: 80, filter: "blur(5px)" },
    {
      opacity: 1,
      duration: 1.2,
      filter: "blur(0px)",
      ease: "power3.inOut",
      y: 0,
      delay: 0.3,
    }
  );

  gsap.fromTo(
    ".landing-info-h2",
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      y: 0,
      delay: 0.8,
    }
  );
  gsap.fromTo(
    [".header", ".icons-section", ".nav-fade"],
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1.2,
      ease: "power1.inOut",
      delay: 0.1,
    }
  );

  loopTimelines.push(createSyncedSwitchTimeline(primaryChars, secondaryChars));
}

function createSyncedSwitchTimeline(
  primaryChars: Element[],
  secondaryChars: Element[]
) {
  const duration = 1.2;
  const showSecondaryAt = 4;
  const showPrimaryAt = 10;
  const primaryResume = ".resume-button-dev";
  const secondaryResume = ".resume-button-ai";

  gsap.set(primaryChars, { opacity: 1, y: 0 });
  gsap.set(secondaryChars, { opacity: 0, y: 80 });
  gsap.set(primaryResume, { autoAlpha: 1, y: 0 });
  gsap.set(secondaryResume, { autoAlpha: 0, y: 80 });
  gsap.set(".resume-button-dev", { pointerEvents: "auto" });
  gsap.set(".resume-button-ai", { pointerEvents: "none" });

  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

  tl.to(
    primaryChars,
    {
      y: -80,
      opacity: 0,
      duration,
      ease: "power3.inOut",
      stagger: 0.03,
    },
    showSecondaryAt
  )
    .to(
      primaryResume,
      {
        y: -80,
        autoAlpha: 0,
        duration,
        ease: "power3.inOut",
      },
      showSecondaryAt
    )
    .fromTo(
      secondaryChars,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        ease: "power3.inOut",
        stagger: 0.03,
        immediateRender: false,
      },
      showSecondaryAt
    )
    .fromTo(
      secondaryResume,
      { y: 80, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration,
        ease: "power3.inOut",
        immediateRender: false,
      },
      showSecondaryAt
    )
    .add(() => {
      gsap.set(".resume-button-dev", { pointerEvents: "none" });
      gsap.set(".resume-button-ai", { pointerEvents: "auto" });
    }, showSecondaryAt)
    .to(
      secondaryChars,
      {
        y: -80,
        opacity: 0,
        duration,
        ease: "power3.inOut",
        stagger: 0.03,
      },
      showPrimaryAt
    )
    .to(
      secondaryResume,
      {
        y: -80,
        autoAlpha: 0,
        duration,
        ease: "power3.inOut",
      },
      showPrimaryAt
    )
    .fromTo(
      primaryChars,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        ease: "power3.inOut",
        stagger: 0.03,
        immediateRender: false,
      },
      showPrimaryAt
    )
    .fromTo(
      primaryResume,
      { y: 80, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration,
        ease: "power3.inOut",
        immediateRender: false,
      },
      showPrimaryAt
    )
    .add(() => {
      gsap.set(".resume-button-dev", { pointerEvents: "auto" });
      gsap.set(".resume-button-ai", { pointerEvents: "none" });
    }, showPrimaryAt);

  return tl;
}
