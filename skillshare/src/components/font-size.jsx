import React from "react";

let curSize = 18;
const FontSize = () => {
  const decreaseText = () => {
    curSize -= 2;
    curSize = parseInt(
      (document.getElementById("content").style.fontSize = `${curSize}px`)
    );
  };
  const increaseText = () => {
    curSize += 2;
    curSize = parseInt(
      (document.getElementById("content").style.fontSize = `${curSize}px`)
    );
  };

  return (
    <div className="textcontrols">
      <button onClick={decreaseText} role="button" id="decreasetext">
        <span>Decrease Font Size</span>
      </button>
      <button onClick={increaseText} role="button" id="increasetext">
        <span>Increase Font Size</span>
      </button>
    </div>
  );
};

// $("#resettext").click(function () {
//   if (curSize != 18) $("#content").css("font-size", 18);
// });

export default FontSize;
