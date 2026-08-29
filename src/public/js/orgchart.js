document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await app.request('/employees');
    const employees = res.data;
    const viewport = document.getElementById('orgchart-viewport');
    if (!viewport) return;
    
    const root = employees.find(e => e.id === 'emp_001') || employees[0];
    const directReports = employees.filter(e => e.id !== root.id).slice(0, 8);
    
    viewport.innerHTML = `
      <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
        <div class="tree-node tree-node-root">
          <img class="tree-avatar" src="https://ui-avatars.com/api/?name=${encodeURIComponent(root.first_name + '+' + root.last_name)}&background=1E3A8A&color=fff" alt="">
          <div class="tree-name">${root.first_name} ${root.last_name}</div>
          <div class="tree-title">${root.designation_title || 'Chief Executive Officer / VP'}</div>
          <div class="tree-dept">${root.department_name || 'Executive Directorate'}</div>
          <span class="badge badge-primary" style="margin-top:8px;">Executive Head</span>
        </div>
        <div class="tree-connector-v"></div>
        <div class="tree-branch">
          ${directReports.map(emp => `
            <div class="tree-node">
              <img class="tree-avatar" src="https://ui-avatars.com/api/?name=${encodeURIComponent(emp.first_name + '+' + emp.last_name)}&background=0D8ABC&color=fff" alt="">
              <div class="tree-name">${emp.first_name} ${emp.last_name}</div>
              <div class="tree-title">${emp.designation_title || 'Department Lead'}</div>
              <div class="tree-dept">${emp.department_name || 'Operations'}</div>
              <span class="badge badge-success" style="margin-top:8px;">Active</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
  }
});
