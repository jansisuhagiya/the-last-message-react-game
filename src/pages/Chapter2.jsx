import { useEffect, useRef } from "react";
import gsap from "gsap";
import Phase14Outside from "../components/Phase14Outside";

export default function Chapter2() {
  const chapterRef = useRef(null);

  useEffect(() => {
    if (!chapterRef.current) return;

    gsap.fromTo(
      chapterRef.current,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      }
    );
  }, []);

  return (
    <main
      ref={chapterRef}
      className="chapter2"
    >
      <Phase14Outside />
    </main>
  );
}