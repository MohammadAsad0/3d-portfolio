export interface SmootherController {
  paused: (value: boolean) => void;
  scrollTop: (value: number) => void;
  scrollTo: (target: string | Element | null | undefined, smooth?: boolean) => void;
  kill: () => void;
}

let sharedSmoother: SmootherController;

export function createSmoother(): SmootherController {
  let isDestroyed = false;

  const setPaused = (value: boolean) => {
    if (isDestroyed) {
      return;
    }

    document.body.style.overflowY = value ? "hidden" : "auto";
  };

  return {
    paused(value: boolean) {
      setPaused(value);
    },
    scrollTop(value: number) {
      if (isDestroyed) {
        return;
      }

      window.scrollTo({ top: value, behavior: "auto" });
    },
    scrollTo(target, smooth = true) {
      if (isDestroyed) {
        return;
      }

      const element =
        typeof target === "string" ? document.querySelector(target) : target ?? null;

      if (!element) {
        return;
      }

      element.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "start",
      });
    },
    kill() {
      if (isDestroyed) {
        return;
      }

      isDestroyed = true;
      document.body.style.overflowY = "auto";
    },
  };
}

export function getSmoother() {
  if (!sharedSmoother) {
    sharedSmoother = createSmoother();
  }

  return sharedSmoother;
}

export function setSmoother(smoother: SmootherController) {
  sharedSmoother = smoother;
}