import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

interface CubeAnimationProps {
  numBlocks: number;
  onBlockClick: (index: number) => void;
}

const Cube_Animation: React.FC<CubeAnimationProps> = ({
  numBlocks,
  onBlockClick,
}) => {
  const cubesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Reset all cubes to flat
  const resetAll = useCallback(() => {
    cubesRef.current.forEach((cube) => {
      if (cube)
        gsap.to(cube, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.4,
          ease: "power2.out",
        });
    });
  }, []);

  // Hover tilt (bottom-right)
  const handlePointerOver = useCallback((index: number) => {
    const cube = cubesRef.current[index];
    if (!cube) return;
    gsap.to(cube, {
      rotateX: -30, // tilt downward
      rotateY: 30, // tilt right
      duration: 0.3,
      ease: "power2.out",
    });
  }, []);

  const handlePointerOut = useCallback((index: number) => {
    const cube = cubesRef.current[index];
    if (!cube) return;
    gsap.to(cube, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  }, []);

  // Ripple effect
  const handleClick = useCallback(
    (index: number) => {
      const rippleColor = "#0565FF";
      const baseDelay = 0.08;
      cubesRef.current.forEach((cube, i) => {
        if (!cube) return;
        const dist = Math.abs(i - index);
        const delay = dist * baseDelay;
        const faces = cube.querySelectorAll<HTMLElement>(".face");
        gsap.to(faces, {
          backgroundColor: rippleColor,
          duration: 0.2,
          delay,
          ease: "power1.out",
          onComplete: () => {
            gsap.to(faces, {
              backgroundColor: "#ffffff",
              duration: 0.5,
              delay: 0.2,
              ease: "power1.inOut",
            });
          },
        });
      });
    },
    [numBlocks]
  );

  // Drop-in animation
  useEffect(() => {
    gsap.from(cubesRef.current, {
      y: -20,
      opacity: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: "power2.out",
    });
  }, []);

  const cubeSize = 50;
  const spacing = 30;

  return (
    <div
      className="relative flex flex-col items-center justify-start"
      style={{
        paddingTop: "20px",
        paddingBottom: "20px",
      }}
    >
      {/* Central grey line */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: 0,
          height: `${numBlocks * (cubeSize + spacing) - spacing}px`,
          width: "2px",
          backgroundColor: "#c0c0c0",
          zIndex: 0,
        }}
      />

      {Array.from({ length: numBlocks }).map((_, i) => (
        <React.Fragment key={i}>
          <div
            ref={(el) => (cubesRef.current[i] = el)}
            onMouseEnter={() => handlePointerOver(i)}
            onMouseLeave={() => handlePointerOut(i)}
            onClick={() => {
              handleClick(i);
              onBlockClick(i); // 👈 notify parent
            }}
            className="cube cursor-pointer"
            style={{
              width: `${cubeSize}px`,
              height: `${cubeSize}px`,
              position: "relative",
              transformStyle: "preserve-3d",
              transformOrigin: "center",
              marginBottom: `${spacing}px`,
              zIndex: 1,
              perspective: "800px", // ✅ Local perspective per cube
              transform: "rotateX(0deg) rotateY(0deg)", // ✅ Start flat
            }}
          >
            {["front", "back", "left", "right", "top", "bottom"].map((face) => (
              <div
                key={face}
                className="face flex items-center justify-center text-xs font-semibold text-gray-800"
                style={{
                  position: "absolute",
                  width: `${cubeSize}px`,
                  height: `${cubeSize}px`,
                  backgroundColor: "#ffffff",
                  border: "1.5px dotted black",
                  transform:
                    face === "front"
                      ? `translateZ(${cubeSize / 2}px)`
                      : face === "back"
                      ? `rotateY(180deg) translateZ(${cubeSize / 2}px)`
                      : face === "right"
                      ? `rotateY(90deg) translateZ(${cubeSize / 2}px)`
                      : face === "left"
                      ? `rotateY(-90deg) translateZ(${cubeSize / 2}px)`
                      : face === "top"
                      ? `rotateX(90deg) translateZ(${cubeSize / 2}px)`
                      : `rotateX(-90deg) translateZ(${cubeSize / 2}px)`,
                }}
              >
                {face === "front" && i}
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Cube_Animation;
