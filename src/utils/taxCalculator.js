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
    const slabs = PAYROLL_CONFIG.incomeTaxSlabs;

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
