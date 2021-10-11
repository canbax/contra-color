import { getInverse, getContrast } from '../src/main';
const assert = require('assert');

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function testRandom(count: number = 10000, contrastThreshold = 3): void {
  for (let i = 0; i < count; i++) {
    const c1 = getRandomColor();
    const c2 = getInverse(c1);
    const constrast = getContrast(c1, c2);
    assert.equal(constrast > contrastThreshold, true);
  }
}

testRandom();

function testManual(color: string) {
  const c2 = getInverse(color);
  const constrast = getContrast(color, c2);

  // assert.equal(constrast > 3, true);
  console.log(' c1: ', color, ' c2: ', c2, ' constrast: ', constrast);
}
// testManual('#CA94BB');