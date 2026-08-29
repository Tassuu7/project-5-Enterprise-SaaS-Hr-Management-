/**
 * WorkSphere Enterprise HRMS - Employees Directory Logic
 * Layer: Frontend Client Module
 */

document.addEventListener('DOMContentLoaded', async () => {
  await loadEmployees();
  await loadDropdowns();

  document.getElementById('add-emp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      firstName: document.getElementById('emp-first').value,
      lastName: document.getElementById('emp-last').value,
      email: document.getElementById('emp-email').value,
      departmentId: document.getElementById('emp-dept').value,
      designationId: document.getElementById('emp-desg').value,
    };
    try {
      await app.request('/employees', { method: 'POST', body: data });
      app.showToast('Employee successfully onboarded', 'success');
      app.closeModal('add-emp-modal');
      await loadEmployees();
    } catch (err) {}
  });
});

async function loadEmployees() {
  const res = await app.request('/employees');
  const tbody = document.getElementById('employees-tbody');
  tbody.innerHTML = res.data.map(e => `
    <tr>
      <td><code>${e.employee_code}</code></td>
      <td><strong>${e.first_name} ${e.last_name}</strong><br><small style="color:var(--text-muted);">${e.email}</small></td>
      <td>${e.department_name || '--'}</td>
      <td>${e.designation_title || '--'}</td>
      <td>${e.work_location || 'Headquarters'}</td>
      <td><span class="badge badge-success">${e.employment_status}</span></td>
      <td>
        <button class="btn btn-sm btn-secondary" onclick="viewEmployee('${e.id}')">360 View</button>
      </td>
    </tr>
  `).join('');
}

async function loadDropdowns() {
  const [depts, desgs] = await Promise.all([
    app.request('/employees/departments'),
    app.request('/employees/designations')
  ]);
  const deptSelect = document.getElementById('emp-dept');
  const desgSelect = document.getElementById('emp-desg');

  deptSelect.innerHTML = depts.data.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
  desgSelect.innerHTML = desgs.data.map(d => `<option value="${d.id}">${d.title}</option>`).join('');
}

function viewEmployee(id) {
  alert('Viewing Employee ID: ' + id);
}
