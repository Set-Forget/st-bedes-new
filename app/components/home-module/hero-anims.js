import gsap from "gsap";

export const arrowAnimation = (arrowRef) => {
  const tl = gsap.timeline();

  const arrow = arrowRef.current;
  if (!arrow) return;  // Just to make sure that ref is available

  const pathLength = arrow.getTotalLength();
  arrow.style.strokeDasharray = `${pathLength}`;
  arrow.style.strokeDashoffset = `${pathLength}`;

  tl.to(arrow, {
    opacity: 1,
    strokeDashoffset: 0,
    duration: 1,
    ease: "slow(0.3,1,false)",
    delay: 2,           // delay initial anim
    repeat: 1,          // repeat once
    yoyo: true,         // reverse anim
    repeatDelay: 2      // repeat delay
  });
};
