// Increase/descrease font size
$("#increasetext").click(function () {
  curSize = parseInt($("#content").css("font-size")) + 2;
  if (curSize <= 32) $("#content").css("font-size", curSize);
});

$("#resettext").click(function () {
  if (curSize != 18) $("#content").css("font-size", 18);
});

$("#decreasetext").click(function () {
  curSize = parseInt($("#content").css("font-size")) - 2;
  if (curSize >= 14) $("#content").css("font-size", curSize);
});
