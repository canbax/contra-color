const RE_HEX = /^(?:[0-9a-f]{3}){1,2}$/i;
const COLOR_WIDTH = 256;

function sRGBtoLin(colorChannel: number) {
  // Send this function a decimal sRGB gamma encoded color channel
  // between 0.0 and 1.0, and it returns a linearized value.
  colorChannel = colorChannel / 255;
  if (colorChannel <= 0.04045) {
    return colorChannel / 12.92;
  } else {
    return Math.pow(((colorChannel + 0.055) / 1.055), 2.4);
  }
}

function luminance(rgb: number[]) {
  const r = sRGBtoLin(rgb[0]);
  const g = sRGBtoLin(rgb[1]);
  const b = sRGBtoLin(rgb[2]);
  return r * 0.2126 + g * 0.7152 + b * 0.0722;
}

// thanks to https://github.com/onury/invert-color
function hex2RGBArray(hex: string) {
  if (hex.slice(0, 1) === '#') {
    hex = hex.slice(1);
  }
  if (!RE_HEX.test(hex)) {
    throw new Error(`Invalid HEX color: "${hex}"`);
  }
  // normalize / convert 3-chars hex to 6-chars.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  return [
    parseInt(hex.slice(0, 2), 16), // r
    parseInt(hex.slice(2, 4), 16), // g
    parseInt(hex.slice(4, 6), 16)  // b
  ];
}

function contrast(rgb1: number[], rgb2: number[]) {
  const l1 = luminance(rgb1);
  const l2 = luminance(rgb2);
  if (l1 > l2) {
    return (l1 + 0.05) / (l2 + 0.05);
  }
  return (l2 + 0.05) / (l1 + 0.05);
}

function padz(str: string, len: number) {
  return (new Array(len).join('0') + str).slice(-len);
}

export function getInverse(c: string) {
  const rgb = hex2RGBArray(c);
  let maxContrast = 0;
  let greedyR = 0;
  let greedyG = 0;
  let greedyB = 0;
  // blue is the least important
  for (let i = 0; i < COLOR_WIDTH; i++) {
    const rgb2 = [greedyR, greedyG, i];
    const currContrast = contrast(rgb, rgb2);
    if (currContrast > maxContrast) {
      maxContrast = currContrast;
      greedyB = i;
    }
  }

  // red is the second most important in luminance
  for (let i = 0; i < COLOR_WIDTH; i++) {
    const rgb2 = [i, greedyG, rgb[2]];
    const currContrast = contrast(rgb, rgb2);
    if (currContrast > maxContrast) {
      maxContrast = currContrast;
      greedyR = i;
    }
  }

  // green is the most important in luminance calculate it last to make a significant impact
  for (let i = 0; i < COLOR_WIDTH; i++) {
    const rgb2 = [rgb[0], i, rgb[2]];
    const currContrast = contrast(rgb, rgb2);
    if (currContrast > maxContrast) {
      maxContrast = currContrast;
      greedyG = i;
    }
  }

  const r = [greedyR, greedyG, greedyB];
  return '#' + r.map(c => padz(c.toString(16), 2)).join('');
}

export function getContrast(c1: string, c2: string) {
  const rgb1 = hex2RGBArray(c1);
  const rgb2 = hex2RGBArray(c2);

  return contrast(rgb1, rgb2);
}