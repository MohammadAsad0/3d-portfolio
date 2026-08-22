import { useEffect } from "react";
import { useLoading } from "../context/LoadingProvider";

const ADSENSE_SCRIPT_ID = "adsense-script";
const ADSENSE_CLIENT =
  import.meta.env.VITE_ADSENSE_CLIENT ?? "ca-pub-2133393479783194";
const ADSENSE_ENABLED = import.meta.env.VITE_ENABLE_ADSENSE === "true";

const AdSenseLoader = () => {
  const { isLoading } = useLoading();

  useEffect(() => {
    if (!ADSENSE_ENABLED || isLoading) return;
    if (!document.querySelector(".section-container")) return;
    if (document.getElementById(ADSENSE_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
    document.head.appendChild(script);
  }, [isLoading]);

  return null;
};

export default AdSenseLoader;
