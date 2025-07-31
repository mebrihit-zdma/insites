  import { Chart, registerables } from 'chart.js';
 export const centerTextPlugin = {
      id: 'centerText',
      beforeDraw: (chart) => {
        if (chart.config.type === 'doughnut') {
          const ctx = chart.ctx;
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

          // Set text properties
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.font = '20px Arial'; // Adjust font size and style as needed
          ctx.fillStyle = '#000'; // Adjust color as needed

          // Get the text to display (e.g., from a custom option in your chart data)
          const centerText = chart.options.plugins.centerText.text || ''; // Access custom option

          // Draw the text
          ctx.fillText(centerText, centerX, centerY);
        }
      }
    };