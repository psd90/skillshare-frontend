import React from "react";

let curSize = 18;
const FontSize = () => {
  const decreaseText = () => {
    if (curSize !== 12) curSize -= 1;
    curSize = parseInt(
      (document.getElementById("content").style.fontSize = `${curSize}px`)
    );
  };
  const increaseText = () => {
    if (curSize !== 22) curSize += 1;
    curSize = parseInt(
      (document.getElementById("content").style.fontSize = `${curSize}px`)
    );
  };

  return (
    <div className="textcontrols">
      <button onClick={increaseText} role="button" className="fontSize">
        <span className="bigA">A</span>
      </button>
      <button onClick={decreaseText} role="button" className="fontSize">
        <span className="smallA">A</span>
      </button>
    </div>
  );
};

// $("#resettext").click(function () {
//   if (curSize != 18) $("#content").css("font-size", 18);
// });

export default FontSize;
