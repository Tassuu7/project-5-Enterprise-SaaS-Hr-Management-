const MatrixCalculator = require('../../src/utils/matrixCalculator');
const CONSTANTS = require('../../src/config/constants');

describe('Performance 9-Box Talent Matrix Suite', () => {
  it('should classify high performance and high potential as STAR', () => {
    const cat = MatrixCalculator.classifyNineBox(3, 3);
    expect(cat.code).toBe(CONSTANTS.NINE_BOX_CATEGORIES.STAR.code);
  });

  it('should classify moderate performance and high potential as HIGH_POTENTIAL', () => {
    const cat = MatrixCalculator.classifyNineBox(2, 3);
    expect(cat.code).toBe(CONSTANTS.NINE_BOX_CATEGORIES.HIGH_POTENTIAL.code);
  });

  it('should classify low performance and low potential as RISK', () => {
    const cat = MatrixCalculator.classifyNineBox(1, 1);
    expect(cat.code).toBe(CONSTANTS.NINE_BOX_CATEGORIES.RISK.code);
  });
});
