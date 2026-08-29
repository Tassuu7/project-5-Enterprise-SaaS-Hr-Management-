document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('new-ticket-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const cat = document.getElementById('tkt-category').value;
      const sub = document.getElementById('tkt-subject').value;
      const prio = document.getElementById('tkt-priority').value;
      const tbody = document.getElementById('tickets-tbody');
      if (!tbody) return;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><code>TKT-${Date.now().toString().slice(-6)}</code></td>
        <td>${cat}</td>
        <td>${sub}</td>
        <td><span class="badge badge-warning">${prio}</span></td>
        <td><span class="badge badge-primary">OPEN</span></td>
      `;
      tbody.prepend(row);
      app.showToast('Ticket submitted successfully!', 'success');
      document.getElementById('tkt-subject').value = '';
    });
  }
});
