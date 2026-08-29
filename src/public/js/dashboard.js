/**
 * WorkSphere Enterprise HRMS - Dashboard Logic
 * Layer: Frontend Client Module
 */

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const summary = await app.request('/analytics/summary');
    const data = summary.data;

    // Populate KPI
    document.getElementById('stat-active-emp').textContent = data.metrics.activeEmployees;
    document.getElementById('stat-depts').textContent = data.metrics.departmentsCount;
    document.getElementById('stat-open-jobs').textContent = data.metrics.openJobRequisitions;
    document.getElementById('stat-pending-leaves').textContent = data.metrics.pendingLeaveRequests;

    // Charts
    const deptLabels = data.charts.departmentDistribution.map(d => d.name);
    const deptCounts = data.charts.departmentDistribution.map(d => d.employee_count);
    EnterpriseCharts.drawBarChart('dept-chart', deptLabels, deptCounts, ['#6366f1', '#14b8a6', '#f59e0b', '#0ea5e9']);

    const genderLabels = data.charts.genderDiversity.map(g => g.gender);
    const genderCounts = data.charts.genderDiversity.map(g => g.count);
    EnterpriseCharts.drawDonutChart('gender-chart', genderLabels, genderCounts, ['#6366f1', '#14b8a6', '#f43f5e']);

    // Attendance Table
    const attRes = await app.request('/attendance/overview');
    const records = attRes.data.records;
    const tbody = document.getElementById('attendance-summary-tbody');
    if (records.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">No punches logged today.</td></tr>';
    } else {
      tbody.innerHTML = records.map(r => `
        <tr>
          <td><strong>${r.first_name} ${r.last_name}</strong> (${r.employee_code})</td>
          <td>${r.department_name || 'Operations'}</td>
          <td>${r.punch_in_time ? new Date(r.punch_in_time).toLocaleTimeString() : '--'}</td>
          <td>${r.punch_out_time ? new Date(r.punch_out_time).toLocaleTimeString() : '--'}</td>
          <td><span class="badge ${r.status === 'PRESENT' ? 'badge-success' : 'badge-warning'}">${r.status}</span></td>
        </tr>
      `).join('');
    }
  } catch (err) {
    console.error('Dashboard load error:', err);
  }
});
