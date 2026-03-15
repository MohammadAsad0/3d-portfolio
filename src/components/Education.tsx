import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Education.css";

gsap.registerPlugin(ScrollTrigger);

const EDUCATION = [
  {
    degree: "MSc Computer Science",
    specialization: "Artificial Intelligence",
    institution: "York University",
    location: "Toronto, Canada",
    period: "2025 — Present",
    courses: ["Probabilistic Models & Machine Learning", "Computer Vision", "Data Mining", "Machine learning Theory", "Data Analytics & Visualization", "Fairness & Biasin AI"],
    progress: 0.5,
    status: "current" as const,
  },
  {
    degree: "BSc Computer Science",
    specialization: "",
    institution: "FAST-NUCES",
    location: "Karachi, Pakistan",
    period: "2019 — 2023",
    courses: [
      "Data Structures & Algorithms",
      "Deep learning for perception",
      "Information Retrieval",
      "Data Science",
      "OOP",
      "Software Engineering",
      "Artificial Intelligence",
      "Databases",
      "Computer Networks",
      "Operating Systems",
    ],
    progress: 1,
    status: "completed" as const,
  },
];

export default function Education() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  /* ── Three.js constellation background ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 50 : 130;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      canvas.clientWidth / (canvas.clientHeight || 600),
      0.1,
      1000
    );
    camera.position.z = 90;

    const doResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight || 600;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    doResize();
    window.addEventListener("resize", doResize);

    /* particles */
    const positions = new Float32Array(COUNT * 3);
    const velocities = Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 0.025,
      y: (Math.random() - 0.5) * 0.015,
    }));

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 180;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x5eead4,
      size: isMobile ? 0.6 : 0.9,
      transparent: true,
      opacity: 0.65,
    });
    scene.add(new THREE.Points(pGeo, pMat));

    /* lines — pre-allocated buffer updated in-place to avoid per-frame GC */
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x5eead4,
      transparent: true,
      opacity: 0.07,
    });
    const CONNECT_DIST = isMobile ? 18 : 28;
    const maxPairs = (COUNT * (COUNT - 1)) / 2;
    const lBuf = new Float32Array(maxPairs * 6);
    const lAttr = new THREE.BufferAttribute(lBuf, 3);
    lAttr.setUsage(THREE.DynamicDrawUsage);
    const lGeo = new THREE.BufferGeometry();
    lGeo.setAttribute("position", lAttr);
    const linesMesh = new THREE.LineSegments(lGeo, lineMat);
    scene.add(linesMesh);

    // Throttle line rebuilds on mobile (every 3rd frame) to save CPU
    const LINE_THROTTLE = isMobile ? 3 : 1;
    let lineFrame = 0;

    const rebuildLines = () => {
      if (++lineFrame % LINE_THROTTLE !== 0) return;
      const pos = pGeo.attributes.position.array as Float32Array;
      let count = 0;
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          if (dx * dx + dy * dy < CONNECT_DIST * CONNECT_DIST) {
            lBuf[count++] = pos[i * 3];
            lBuf[count++] = pos[i * 3 + 1];
            lBuf[count++] = pos[i * 3 + 2];
            lBuf[count++] = pos[j * 3];
            lBuf[count++] = pos[j * 3 + 1];
            lBuf[count++] = pos[j * 3 + 2];
          }
        }
      }
      lAttr.needsUpdate = true;
      lGeo.setDrawRange(0, count / 3);
    };

    /* floating orb accents */
    const orbGeo = new THREE.SphereGeometry(1.2, 16, 16);
    const orbMat = new THREE.MeshBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.18,
    });
    const orbs = Array.from({ length: 5 }, () => {
      const m = new THREE.Mesh(orbGeo, orbMat.clone());
      m.position.set(
        (Math.random() - 0.5) * 140,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 10
      );
      m.scale.setScalar(Math.random() * 2 + 1);
      scene.add(m);
      return m;
    });

    /* GSAP floating orb pulses */
    orbs.forEach((orb) => {
      gsap.to((orb.material as THREE.MeshBasicMaterial), {
        opacity: 0.4,
        duration: Math.random() * 2 + 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2,
      });
      gsap.to(orb.position, {
        y: orb.position.y + (Math.random() - 0.5) * 8,
        duration: Math.random() * 4 + 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 2,
      });
    });

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const pos = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        if (pos[i * 3] > 90) pos[i * 3] = -90;
        if (pos[i * 3] < -90) pos[i * 3] = 90;
        if (pos[i * 3 + 1] > 50) pos[i * 3 + 1] = -50;
        if (pos[i * 3 + 1] < -50) pos[i * 3 + 1] = 50;
      }
      pGeo.attributes.position.needsUpdate = true;
      rebuildLines();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", doResize);
      pGeo.dispose();
      pMat.dispose();
      lGeo.dispose();
      orbGeo.dispose();
      renderer.dispose();
    };
  }, []);

  /* ── GSAP scroll animations ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* title reveal */
      gsap.fromTo(
        ".edu-title",
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".edu-section",
            start: "top 78%",
            once: true,
          },
        }
      );

      /* cards stagger in */
      gsap.fromTo(
        ".edu-card",
        { opacity: 0, y: 55, rotateX: 6 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.75,
          stagger: 0.18,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".edu-cards",
            start: "top 82%",
            once: true,
          },
        }
      );

      /* progress bar fill */
      gsap.fromTo(
        ".edu-progress-fill",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.4,
          stagger: 0.25,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".edu-cards",
            start: "top 78%",
            once: true,
          },
        }
      );

      /* course tags stagger */
      gsap.fromTo(
        ".edu-tag",
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.04,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".edu-cards",
            start: "top 70%",
            once: true,
          },
        }
      );

      /* repeat glow pulse on current badge */
      gsap.to(".edu-badge-current", {
        boxShadow: "0 0 18px rgba(94,234,212,0.55)",
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className="edu-section section-container"
      ref={sectionRef}
      id="education"
    >
      <canvas className="edu-canvas" ref={canvasRef} />

      <h3 className="title edu-title">Education</h3>

      <div className="edu-cards">
        {EDUCATION.map((edu, i) => (
          <div
            className={`edu-card ${edu.status === "current" ? "edu-card-current" : ""}`}
            key={i}
          >
            <div className="edu-card-header">
              <span
                className={`edu-badge ${
                  edu.status === "current"
                    ? "edu-badge-current"
                    : "edu-badge-done"
                }`}
              >
                {edu.status === "current" ? "In Progress" : "Completed"}
              </span>
              <span className="edu-period">{edu.period}</span>
            </div>

            <h4 className="edu-degree">{edu.degree}</h4>
            {edu.specialization && (
              <p className="edu-spec">{edu.specialization}</p>
            )}

            <div className="edu-institution">
              <span className="edu-inst-name">{edu.institution}</span>
              <span className="edu-inst-loc">{edu.location}</span>
            </div>

            <div className="edu-progress">
              <div
                className="edu-progress-fill"
                style={{
                  transformOrigin: "left center",
                  width: `${edu.progress * 100}%`,
                }}
              />
            </div>

            <div className="edu-courses">
              {edu.courses.map((c) => (
                <span className="edu-tag" key={c}>
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
