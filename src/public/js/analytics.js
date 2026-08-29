document.addEventListener('DOMContentLoaded', async () => {
  try {
    const summary = await app.request('/analytics/summary');
    const data = summary.data;

    const deptLabels = data.charts.departmentDistribution.map(d => d.name);
    const deptCounts = data.charts.departmentDistribution.map(d => d.employee_count);
    if (document.getElementById('dept-analytics-chart')) {
      EnterpriseCharts.drawBarChart('dept-analytics-chart', deptLabels, deptCounts, ['#6366f1', '#14b8a6', '#f59e0b', '#0ea5e9']);
    }

    const genderLabels = data.charts.genderDiversity.map(g => g.gender);
    const genderCounts = data.charts.genderDiversity.map(g => g.count);
    if (document.getElementById('gender-analytics-chart')) {
      EnterpriseCharts.drawDonutChart('gender-analytics-chart', genderLabels, genderCounts, ['#6366f1', '#14b8a6', '#f43f5e']);
    }
  } catch (err) {
    console.error(err);
  }
});
