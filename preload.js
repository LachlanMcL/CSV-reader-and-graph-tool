const { contextBridge } = require('electron')
const Chart = require('chart.js/auto')
const math = require('mathjs')

let chart;
contextBridge.exposeInMainWorld('electron', {
    createChart: (ctx, params) => {
        if (chart) chart.destroy();
        chart = new Chart(ctx, params);
    }
});

contextBridge.exposeInMainWorld('math', {
    mode: (...args) => math.mode(...args)
});