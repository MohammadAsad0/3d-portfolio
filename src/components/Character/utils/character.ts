import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { decryptFile } from "./decrypt";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const modelDecryptionKey = import.meta.env.VITE_CHARACTER_MODEL_KEY;
  const legacyModelKey = import.meta.env.VITE_CHARACTER_MODEL_KEY_LEGACY;
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = async (): Promise<GLTF | null> => {
    try {
      const keyCandidates = Array.from(
        new Set(
          [
            modelDecryptionKey,
            legacyModelKey,
          ].filter((key): key is string => Boolean(key))
        )
      );

      if (!keyCandidates.length) {
        console.warn(
          "Character model key is not configured; skipping 3D character load."
        );
        return null;
      }

      for (const key of keyCandidates) {
        try {
          const encryptedBlob = await decryptFile("/models/character.enc?v=2", key);
          const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

          const gltf = await new Promise<GLTF>((resolve, reject) => {
            loader.load(blobUrl, resolve, undefined, reject);
          });
          URL.revokeObjectURL(blobUrl);

          const character = gltf.scene;
          await renderer.compileAsync(character, camera, scene);
          character.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const mesh = child;

              // Change clothing colors to match site theme
              if (mesh.material) {
                if (mesh.name === "BODY.SHIRT") {
                  const newMat = (
                    mesh.material as THREE.Material
                  ).clone() as THREE.MeshStandardMaterial;
                  newMat.color = new THREE.Color("#8B4513");
                  mesh.material = newMat;
                } else if (mesh.name === "Pant") {
                  const newMat = (
                    mesh.material as THREE.Material
                  ).clone() as THREE.MeshStandardMaterial;
                  newMat.color = new THREE.Color("#000000");
                  mesh.material = newMat;
                }
              }

              mesh.castShadow = true;
              mesh.receiveShadow = true;
              mesh.frustumCulled = true;
            }
          });

          dracoLoader.dispose();
          return gltf;
        } catch (error) {
          console.warn("Character decrypt/load failed for one key candidate.", error);
        }
      }

      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  return { loadCharacter };
};

export default setCharacter;
