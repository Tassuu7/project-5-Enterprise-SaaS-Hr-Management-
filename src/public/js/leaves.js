document.addEventListener('DOMContentLoaded', () => {
  loadLeaves();
  const form = document.getElementById('apply-leave-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        employeeId: 'emp_001',
        leaveTypeId: document.getElementById('leave-type-select').value,
        startDate: document.getElementById('leave-start').value,
        endDate: document.getElementById('leave-end').value,
        reason: document.getElementById('leave-reason').value,
        isHalfDay: false,
      };
      try {
        await app.request('/leaves/apply', { method: 'POST', body: data });
        app.showToast('Leave request submitted successfully!', 'success');
        await loadLeaves();
      } catch (err) {}
    });
  }
});

async function loadLeaves() {
  try {
    const res = await app.request('/leaves/requests');
    const requests = res.data;
    const tbody = document.getElementById('leaves-tbody');
    if (!tbody) return;
    if (requests.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:30px;">No leave requests recorded yet. Submit the form above to apply.</td></tr>';
    } else {
      tbody.innerHTML = requests.map(r => `
        <tr>
          <td><strong>${r.first_name} ${r.last_name}</strong></td>
          <td>${r.leave_type_name || 'Annual Vacation'}</td>
          <td>${r.start_date} to ${r.end_date}</td>
          <td><strong>${r.total_days} Days</strong></td>
          <td>${r.reason}</td>
          <td><span class="badge ${r.status === 'APPROVED' ? 'badge-success' : 'badge-warning'}">${r.status}</span></td>
        </tr>
      `).join('');
    }
  } catch (e) {
    console.error(e);
  }
}
