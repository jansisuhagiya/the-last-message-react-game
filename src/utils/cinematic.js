import gsap from "gsap";

export function cameraShake() {
  const scene =
    document.querySelector(
      ".cinematic-room"
    );

  if (!scene) return;

  gsap.timeline()
    .to(scene, {
      x: -5,
      duration: 0.06,
    })
    .to(scene, {
      x: 5,
      duration: 0.06,
    })
    .to(scene, {
      x: -3,
      duration: 0.05,
    })
    .to(scene, {
      x: 3,
      duration: 0.05,
    })
    .to(scene, {
      x: 0,
      duration: 0.12,
    });
}