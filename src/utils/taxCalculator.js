/**
 * WorkSphere Enterprise HRMS - Progressive Tax & Statutory Computation Engine
 * Layer: Utilities
 */

const PAYROLL_CONFIG = require('../config/payroll.config');

class TaxCalculator {
  static calculateAnnualTax(annualTaxableIncome) {
    const standardDeduction = PAYROLL_CONFIG.standardDeductionAnnual || 12000;
    const netTaxable = Math.max(0, annualTaxableIncome - standardDeduction);

    let tax = 0;
    const slabs = [
      { min: 0, max: 25000, rate: 0.00 },
      { min: 25000, max: 50000, rate: 0.10 },
      { min: 50000, max: 100000, rate: 0.20 },
      { min: 100000, max: 175000, rate: 0.28 },
      { min: 175000, max: Infinity, rate: 0.35 },
    ];

    for (let i = 0; i < slabs.length; i++) {
      const slab = slabs[i];
      if (netTaxable > slab.min) {
        const taxableInSlab = Math.min(netTaxable, slab.max) - slab.min;
        tax += taxableInSlab * slab.rate;
      }
    }

    return parseFloat(tax.toFixed(2));
  }

  static calculateMonthlyTDS(annualGross) {
    const annualTax = TaxCalculator.calculateAnnualTax(annualGross);
    return parseFloat((annualTax / 12).toFixed(2));
  }
}

module.exports = TaxCalculator;
