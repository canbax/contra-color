import { getContrastingColor, getContrast } from "../src/main";
const assert = require("assert");

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function testRandom(
  count: number = 10000,
  contrastThreshold = 3,
  isLinearLuminance = true
): void {
  let totContrast = 0;
  for (let i = 0; i < count; i++) {
    const c1 = getRandomColor();
    const c2 = getContrastingColor(c1, isLinearLuminance);
    totContrast += c2.contrast;
    // console.log(" c1: ", c1, " c2: ", c2.color, " constrast: ", c2.contrast);
    assert.equal(c2.contrast > contrastThreshold, true);
  }
  console.log("avg contrast: ", totContrast / count);
}

function testManual(
  color: string,
  isLinearLuminance = true,
  minContrastDiff = 3,
  maxContrastDiff = -1
) {
  let c2 = null;
  if (maxContrastDiff > 0) {
    c2 = getContrastingColor(color, isLinearLuminance, minContrastDiff);
  } else {
    c2 = getContrastingColor(color, isLinearLuminance);
  }
  assert.equal(c2.contrast > minContrastDiff, true);
  if (maxContrastDiff > 0) {
    assert.equal(c2.contrast < maxContrastDiff, true);
  }
  console.log(" c1: ", color, " c2: ", c2.color, " constrast: ", c2.contrast);
}

function testCertainCases(isLinearLuminance = true) {
  testManual("#CA94BB", isLinearLuminance, 21);
  testManual("#000000", isLinearLuminance);
  testManual("#FFFFFF", isLinearLuminance);
  testManual("#7f7f7f", isLinearLuminance);
  testManual("#808080", isLinearLuminance);
}

function test4CustomContrastDiff() {
  testManual("#CA94BB", true, 3, 3.5);
  testManual("#000000", true, 3, 3.5);
  testManual("#FFFFFF", true, 3, 3.5);
  testManual("#7f7f7f", true, 3, 3.5);
  testManual("#808080", true, 3, 3.5);
}

const t1 = new Date().getTime();
test4CustomContrastDiff();
testCertainCases();
testCertainCases(false);
testRandom();
testRandom(10000, 3, false);
console.log('delta time: ', (new Date().getTime() - t1) / 1000, ' seconds ');