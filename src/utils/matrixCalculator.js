/**
 * WorkSphere Enterprise HRMS - 9-Box Talent & Performance Matrix Classifier
 * Layer: Utilities
 */

const CONSTANTS = require('../config/constants');

class MatrixCalculator {
  static classifyNineBox(performanceScore, potentialScore) {
    // Scores scale: 1 (Low), 2 (Medium), 3 (High)
    const p = Math.min(3, Math.max(1, Math.round(performanceScore)));
    const pot = Math.min(3, Math.max(1, Math.round(potentialScore)));

    if (pot === 3 && p === 3) return CONSTANTS.NINE_BOX_CATEGORIES.STAR;
    if (pot === 3 && p === 2) return CONSTANTS.NINE_BOX_CATEGORIES.HIGH_POTENTIAL;
    if (pot === 3 && p === 1) return CONSTANTS.NINE_BOX_CATEGORIES.ENIGMA;

    if (pot === 2 && p === 3) return CONSTANTS.NINE_BOX_CATEGORIES.HIGH_PERFORMER;
    if (pot === 2 && p === 2) return CONSTANTS.NINE_BOX_CATEGORIES.CORE_EMPLOYEE;
    if (pot === 2 && p === 1) return CONSTANTS.NINE_BOX_CATEGORIES.DILEMMA;

    if (pot === 1 && p === 3) return CONSTANTS.NINE_BOX_CATEGORIES.SOLID_PRO;
    if (pot === 1 && p === 2) return CONSTANTS.NINE_BOX_CATEGORIES.UNDERPERFORMER;
    return CONSTANTS.NINE_BOX_CATEGORIES.RISK;
  }
}

module.exports = MatrixCalculator;
