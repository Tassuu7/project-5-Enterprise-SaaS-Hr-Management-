const TaxCalculator = require('../../src/utils/taxCalculator');
const FormulaEngine = require('../../src/utils/formulaEngine');

describe('Payroll & Statutory Calculator Suite', () => {
  it('should calculate annual tax based on progressive tax slabs', () => {
    const tax1 = TaxCalculator.calculateAnnualTax(30000); // taxable: 18000 (0% below 25k)
    expect(tax1).toBe(0);

    const tax2 = TaxCalculator.calculateAnnualTax(80000); // taxable: 68000 (25k @ 0% + 25k @ 10% + 18k @ 20% = 2500 + 3600 = 6100)
    expect(tax2).toBe(6100);
  });

  it('should calculate monthly TDS correctly', () => {
    const monthlyTds = TaxCalculator.calculateMonthlyTDS(80000);
    expect(monthlyTds).toBe(508.33);
  });

  it('should parse and evaluate custom compensation formulas', () => {
    const engine = new FormulaEngine({ basic: 5000, bonus: 1000, rate: 0.15 });
    const result = engine.evaluate('basic + bonus - (basic * rate)');
    expect(result).toBe(5250);
  });
});
