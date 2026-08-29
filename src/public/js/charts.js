/**
 * WorkSphere Enterprise HRMS - Lightweight Canvas-based Charting Engine
 * Layer: Frontend Utilities
 */

class EnterpriseCanvasCharts {
  static drawBarChart(canvasId, labels, data, colors = ['#6366f1']) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = canvas.parentElement.clientHeight || 260;

    ctx.clearRect(0, 0, width, height);

    const padding = 40;
    const chartHeight = height - padding * 2;
    const chartWidth = width - padding * 2;
    const maxVal = Math.max(...data, 10);
    const barWidth = (chartWidth / data.length) * 0.55;

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw Bars
    data.forEach((val, index) => {
      const x = padding + index * (chartWidth / data.length) + (chartWidth / data.length - barWidth) / 2;
      const h = (val / maxVal) * chartHeight;
      const y = height - padding - h;

      const grad = ctx.createLinearGradient(0, y, 0, height - padding);
      grad.addColorStop(0, colors[index % colors.length] || '#6366f1');
      grad.addColorStop(1, 'rgba(99, 102, 241, 0.2)');

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth, h);

      // Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[index] || '', x + barWidth / 2, height - padding + 18);

      // Value
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(val, x + barWidth / 2, y - 6);
    });
  }

  static drawDonutChart(canvasId, labels, data, colors = ['#6366f1', '#14b8a6', '#f59e0b', '#f43f5e']) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth;
    const height = canvas.height = canvas.parentElement.clientHeight || 260;

    ctx.clearRect(0, 0, width, height);

    const total = data.reduce((a, b) => a + b, 0) || 1;
    let startAngle = -0.5 * Math.PI;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    data.forEach((val, i) => {
      const sliceAngle = (val / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.arc(centerX, centerY, radius * 0.6, startAngle + sliceAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      startAngle += sliceAngle;
    });

    // Center Text
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${total} Total`, centerX, centerY);
  }
}

window.EnterpriseCharts = EnterpriseCanvasCharts;
