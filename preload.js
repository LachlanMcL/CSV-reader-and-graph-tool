const { contextBridge } = require('electron')
const Chart = require('chart.js/auto')

let chart;
contextBridge.exposeInMainWorld('electron', {
    createChart: (ctx, params) => {
        if (chart) chart.destroy();
        chart = new Chart(ctx, params);
    }
})