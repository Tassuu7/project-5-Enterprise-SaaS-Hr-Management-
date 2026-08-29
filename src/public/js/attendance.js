function updateTimer() {
  const now = new Date();
  const clockEl = document.getElementById('clock-display');
  const dateEl = document.getElementById('date-display');
  if (clockEl) clockEl.textContent = now.toLocaleTimeString();
  if (dateEl) dateEl.textContent = now.toLocaleDateString(undefined, { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}
setInterval(updateTimer, 1000);

document.addEventListener('DOMContentLoaded', () => {
  updateTimer();
  loadAttendance();
});

async function loadAttendance() {
  try {
    const res = await app.request('/attendance/overview');
    const records = res.data.records;
    const tbody = document.getElementById('attendance-tbody');
    if (!tbody) return;
    if (records.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:30px;">No punches recorded today. Click \'Punch In\' above to register live attendance.</td></tr>';
    } else {
      tbody.innerHTML = records.map(r => `
        <tr>
          <td><code>${r.employee_code}</code></td>
          <td><strong>${r.first_name} ${r.last_name}</strong></td>
          <td>${r.department_name || 'Engineering'}</td>
          <td>${r.punch_in_time ? new Date(r.punch_in_time).toLocaleTimeString() : '--'}</td>
          <td>${r.punch_out_time ? new Date(r.punch_out_time).toLocaleTimeString() : '--'}</td>
          <td><strong>${r.total_work_hours || 0} hrs</strong></td>
          <td><span class="badge ${r.status === 'PRESENT' ? 'badge-success' : 'badge-warning'}">${r.status}</span></td>
        </tr>
      `).join('');
    }
  } catch (e) {
    console.error(e);
  }
}

async function punchIn() {
  try {
    await app.request('/attendance/punch-in', {
      method: 'POST',
      body: { employeeId: 'emp_001', notes: 'Biometric virtual punch' }
    });
    app.showToast('Punched In successfully!', 'success');
    await loadAttendance();
  } catch (e) {}
}

async function punchOut() {
  try {
    await app.request('/attendance/punch-out', {
      method: 'POST',
      body: { employeeId: 'emp_001', notes: 'Shift completed' }
    });
    app.showToast('Punched Out successfully!', 'success');
    await loadAttendance();
  } catch (e) {}
}
