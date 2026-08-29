/**
 * WorkSphere Enterprise HRMS - Statutory & Compensation Rules Config
 * Layer: Configuration
 */

const PAYROLL_CONFIG = {
  currency: {
    symbol: '$',
    code: 'USD',
    locale: 'en-US',
  },
  components: {
    basic: { percentageOfGross: 50, taxable: true },
    hra: { percentageOfGross: 20, taxable: true },
    conveyance: { flat: 200, taxable: false, maxExemption: 200 },
    medicalAllowance: { flat: 150, taxable: false, maxExemption: 150 },
    specialAllowance: { dynamicRemaining: true, taxable: true },
  },
  statutoryDeductions: {
    providentFund: {
      employeeContributionPercent: 6.0,
      employerContributionPercent: 6.0,
      wageCap: 10000,
    },
    healthInsurance: {
      employeeContributionPercent: 1.5,
      employerContributionPercent: 3.5,
      threshold: 5000,
    },
    professionalTax: {
      slabs: [
        { minGross: 0, maxGross: 3000, tax: 0 },
        { minGross: 3001, maxGross: 6000, tax: 50 },
        { minGross: 6001, maxGross: 10000, tax: 100 },
        { minGross: 10001, maxGross: Infinity, tax: 150 },
      ]
    },
  },
  incomeTaxSlabs: [
    { min: 0, max: 25000, rate: 0.00 },
    { min: 25001, max: 50000, rate: 0.10 },
    { min: 50001, max: 100000, rate: 0.20 },
    { min: 100001, max: 175000, rate: 0.28 },
    { min: 175001, max: Infinity, rate: 0.35 },
  ],
  standardDeductionAnnual: 12000,
  overtime: {
    standardHoursPerWeek: 40,
    multiplier: 1.5,
    weekendMultiplier: 2.0,
  }
};

module.exports = PAYROLL_CONFIG;
