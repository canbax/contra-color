document.addEventListener("DOMContentLoaded", onLoaded);

function onLoaded() {
  document.getElementById("color1").addEventListener("change", () => {
    setColors();
  });

  document.getElementById("color2").addEventListener("change", () => {
    setColors();
  });

  document.getElementById("randColor1").addEventListener("click", () => {
    document.getElementById("color1").value = getRandomColor();
    setColors();
  });

  document.getElementById("randColor2").addEventListener("click", () => {
    document.getElementById("color2").value = getRandomColor();
    setColors();
  });

  document.getElementById("findIdealColor").addEventListener("click", () => {
    const bgColor = document.getElementById("color1").value;
    const isLinear = document.getElementById("isLinearLuminance").checked;
    const diff = document.getElementById("contrastDiff").value;
    const contrastColor = contraColor.getContrastingColor(
      bgColor,
      isLinear,
      diff
    );
    document.getElementById("color2").value = contrastColor.color;
    setColors();
  });

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function setColors() {
    const bgColor = document.getElementById("color1").value;
    const fontColor = document.getElementById("color2").value;
    const showDiv = document.getElementById("show-colors");
    showDiv.style.color = fontColor;
    showDiv.style.backgroundColor = bgColor;

    const contrast = contraColor.getContrast(bgColor, fontColor);
    const contrast2 = contraColor.getContrast(bgColor, fontColor, false);

    document.getElementById("linearContrast").innerText = contrast.toFixed(2);
    document.getElementById("nonLinearContrast").innerText =
      contrast2.toFixed(2);
  }

  setColors();
}
