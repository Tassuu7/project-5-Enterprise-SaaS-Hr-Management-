/**
 * WorkSphere Enterprise HRMS - Dynamic Formula & Custom Compensation Expression Evaluator
 * Layer: Utilities
 */

class FormulaEngine {
  constructor(context = {}) {
    this.context = context;
  }

  setVariable(name, value) {
    this.context[name] = typeof value === 'number' ? value : parseFloat(value) || 0;
  }

  evaluate(expression) {
    if (!expression || typeof expression !== 'string') return 0;

    let sanitized = expression;
    for (const [key, val] of Object.entries(this.context)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      sanitized = sanitized.replace(regex, val);
    }

    try {
      if (!/^[0-9+\-*/().\s]+$/.test(sanitized)) {
        throw new Error('Invalid characters in formula expression');
      }
      // Safe arithmetic evaluator
      const fn = new Function(`return (${sanitized});`);
      const result = fn();
      return isNaN(result) ? 0 : parseFloat(result.toFixed(2));
    } catch (err) {
      return 0;
    }
  }
}

module.exports = FormulaEngine;
