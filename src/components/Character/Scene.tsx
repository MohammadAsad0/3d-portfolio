import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";
import { setAllTimeline, setCharTimeline } from "../utils/GsapScroll";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  useEffect(() => {
    if (canvasDiv.current) {
      let rect = canvasDiv.current.getBoundingClientRect();
      let container = { width: rect.width, height: rect.height };
      const aspect = container.width / container.height;
      const scene = sceneRef.current;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(container.width, container.height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      canvasDiv.current.appendChild(renderer.domElement);

      const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
      camera.position.z = 10;
      camera.position.set(0, 13.1, 24.7);
      camera.zoom = 1.1;
      camera.updateProjectionMatrix();

      let headBone: THREE.Object3D | null = null;
      let screenLight: any | null = null;
      let mixer: THREE.AnimationMixer;
      let animationFrameId = 0;

      const clock = new THREE.Clock();

      const light = setLighting(scene);
      let progress = setProgress((value) => setLoading(value));
      const { loadCharacter } = setCharacter(renderer, scene, camera);
      let isDisposed = false;
      let hoverCleanup: (() => void) | undefined;

      let resizeHandler: (() => void) | null = null;

      loadCharacter().then((gltf) => {
        if (isDisposed) return;
        if (gltf) {
          scene.getObjectByName("__portfolioCharacter")?.removeFromParent();

          const animations = setAnimations(gltf);
          if (hoverDivRef.current) {
            hoverCleanup = animations.hover(gltf, hoverDivRef.current) || undefined;
          }
          mixer = animations.mixer;
          let character = gltf.scene;
          character.name = "__portfolioCharacter";
          scene.add(character);
          setCharTimeline(character, camera);
          setAllTimeline();
          character.getObjectByName("footR")!.position.y = 3.36;
          character.getObjectByName("footL")!.position.y = 3.36;
          headBone = character.getObjectByName("spine006") || null;
          screenLight = character.getObjectByName("screenlight") || null;
          progress.loaded().then(() => {
            if (isDisposed) return;
            setTimeout(() => {
              if (isDisposed) return;
              light.turnOnLights();
              animations.startIntro();
            }, 2500);
          });
          resizeHandler = () => {
            handleResize(renderer, camera, canvasDiv, character);
          };
          window.addEventListener("resize", resizeHandler);
        } else {
          // Allow app boot to continue even if 3D asset is unavailable.
          progress.clear();
        }
      });

      let mouse = { x: 0, y: 0 },
        interpolation = { x: 0.1, y: 0.2 };

      const onMouseMove = (event: MouseEvent) => {
        handleMouseMove(event, (x, y) => (mouse = { x, y }));
      };
      let debounce: number | undefined;
      let touchMoveElement: HTMLElement | null = null;
      const onTouchMove = (e: TouchEvent) => {
        handleTouchMove(e, (x, y) => (mouse = { x, y }));
      };
      const onTouchStart = (event: TouchEvent) => {
        const element = event.target as HTMLElement;
        debounce = setTimeout(() => {
          touchMoveElement = element;
          touchMoveElement?.addEventListener("touchmove", onTouchMove);
        }, 200);
      };

      const onTouchEnd = () => {
        handleTouchEnd((x, y, interpolationX, interpolationY) => {
          mouse = { x, y };
          interpolation = { x: interpolationX, y: interpolationY };
        });
      };

      document.addEventListener("mousemove", onMouseMove);
      const landingDiv = document.getElementById("landingDiv");
      if (landingDiv) {
        landingDiv.addEventListener("touchstart", onTouchStart);
        landingDiv.addEventListener("touchend", onTouchEnd);
      }
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        if (headBone) {
          handleHeadRotation(
            headBone,
            mouse.x,
            mouse.y,
            interpolation.x,
            interpolation.y,
            THREE.MathUtils.lerp
          );
          light.setPointLight(screenLight);
        }
        const delta = clock.getDelta();
        if (mixer) {
          mixer.update(delta);
        }
        renderer.render(scene, camera);
      };
      animate();
      return () => {
        isDisposed = true;
        clearTimeout(debounce);
        cancelAnimationFrame(animationFrameId);
        hoverCleanup?.();
        scene.clear();
        renderer.dispose();
        if (resizeHandler) {
          window.removeEventListener("resize", resizeHandler);
        }
        if (canvasDiv.current) {
          canvasDiv.current.removeChild(renderer.domElement);
        }
        touchMoveElement?.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("mousemove", onMouseMove);
        if (landingDiv) {
          landingDiv.removeEventListener("touchstart", onTouchStart);
          landingDiv.removeEventListener("touchend", onTouchEnd);
        }
      };
    }
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
