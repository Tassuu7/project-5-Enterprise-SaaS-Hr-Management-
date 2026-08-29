/**
 * WorkSphere Enterprise HRMS - RFC 4180 Compliant CSV Export Generator
 * Layer: Utilities
 */

class CsvExporter {
  static generate(rows = [], headers = null) {
    if (rows.length === 0) return '';
    const columnHeaders = headers || Object.keys(rows[0]);

    const escapeCell = (cell) => {
      if (cell === null || cell === undefined) return '""';
      const str = String(cell);
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return `"${str}"`;
    };

    const headerLine = columnHeaders.map(escapeCell).join(',');
    const bodyLines = rows.map((row) => columnHeaders.map((col) => escapeCell(row[col])).join(','));

    // Include UTF-8 BOM for Excel compatibility
    return '\uFEFF' + [headerLine, ...bodyLines].join('\r\n');
  }
}

module.exports = CsvExporter;
