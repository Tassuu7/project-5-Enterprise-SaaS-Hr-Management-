document.addEventListener('DOMContentLoaded', () => {
  calculateBreakdown();
});

async function calculateBreakdown() {
  const input = document.getElementById('calc-ctc');
  if (!input) return;
  const ctc = parseFloat(input.value) || 120000;
  const monthly = ctc / 12;
  const basic = monthly * 0.50;
  const hra = monthly * 0.20;
  const allowance = Math.max(0, monthly - (basic + hra));
  const tds = (ctc * 0.15) / 12;
  const deductions = 600 + 100 + tds;
  const net = monthly - deductions;

  if (document.getElementById('lbl-basic')) document.getElementById('lbl-basic').textContent = '$' + basic.toFixed(2);
  if (document.getElementById('lbl-hra')) document.getElementById('lbl-hra').textContent = '$' + hra.toFixed(2);
  if (document.getElementById('lbl-allowance')) document.getElementById('lbl-allowance').textContent = '$' + allowance.toFixed(2);
  if (document.getElementById('lbl-tds')) document.getElementById('lbl-tds').textContent = '$' + tds.toFixed(2);
  if (document.getElementById('lbl-net')) document.getElementById('lbl-net').textContent = '$' + net.toFixed(2);
}

async function runPayroll() {
  try {
    const res = await app.request('/payroll/run', {
      method: 'POST',
      body: { month: new Date().getMonth() + 1, year: new Date().getFullYear() }
    });
    app.showToast(`Batch processed for ${res.data.total_employees} employees! Total Net: $${res.data.total_net_payable.toLocaleString()}`, 'success');
  } catch (err) {}
}
