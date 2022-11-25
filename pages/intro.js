import { useState } from "react";

export default function Intro() {
  const [ring3position, setRing3position] = useState({
    top: "0",
    left: "0",
  });
  const handleMouseMove = (e) => {
    if (typeof document != "undefined" && typeof screen != "undefined") {
      const x = e.nativeEvent.pageX;
      const y = e.nativeEvent.pageY;
      const h = screen.height;
      const w = screen.width;
      //   const ring3move = document.getElementById("ring3move");
      console.log({ x, y, h, w });
      setRing3position({
        top: (h - 80 - y).toString() + "px",
        left: (w - x).toString() + "px",
      });
      ring3move.style.top = h - y;
      ring3move.style.left = w - x;
    }
  };

  return (
    <div
      className="w-screem h-screen flex flex-col justify-center items-center"
      onMouseMove={handleMouseMove}
    >
      <div className="flex flex-col w-[500px]  ">
        <p className="text-[90px] font-[500] leading-[70px]">ONE ADDR</p>
        <p className="text-[90px] font-[500] leading-[70px]">FOREVER</p>
        <p className="text-[90px] font-[500] leading-[70px]">ONE RING3</p>
        <p className="text-[16px] font-[200] italic mt-[10px]">
          Has anyone promised you that he will only love you in his life?
          <br />
          But the word of mouth is no good in the end?
          <br />
          Cast an SBT with your partner!
          <br />
          The more assets in your address, the more sincere you are!
        </p>
      </div>
      <div
        id="ring3move"
        className="absolute flex text-[250px] font-[800] opacity-10 pointer-events-none leading-[190px] transform -translate-y-1/2 -translate-x-1/2 "
        style={{
          top: "0",
          left: "0",
        }}
        style={ring3position}
      >
        Ring3
      </div>
    </div>
  );
}
