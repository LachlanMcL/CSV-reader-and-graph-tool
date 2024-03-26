(() => {
    const topNavBarGraphButton = document.getElementById("graphTab")

    const meanGraphButton = document.getElementById("meanGraphButton")
    const modeGraphButton = document.getElementById("modeGraphButton")
    const medianGraphButton = document.getElementById("medianGraphButton")
    
    let cellSelectionIndex;
    topNavBarGraphButton.addEventListener('click', () => {
        cellSelectionIndex = JSON.parse(localStorage.getItem('cellSelectionIndex'))
    })

    setGraphEvent(meanGraphButton, getAverageOfSelectedData)
    setGraphEvent(modeGraphButton, getModeOfSelectedData)
    setGraphEvent(medianGraphButton, getMedianOfSelectedData)

    function setGraphEvent(analysisButton, analysisMethod) {
        analysisButton.addEventListener('click', () => {
            let selectedCSVdata = getSelectedCSVdata(cellSelectionIndex)
            let graphData = analysisMethod(selectedCSVdata)
            displayGraph(graphData)
        })
    }

    function getSelectedCSVdata(cellSelectionIndex) {
        let selectedCSVdata = new Map()
        const regex = /col(\d+)/
        cellSelectionIndex.forEach(index => {
            let indexNumber = index.match(regex)[1]
            let dataset = [...JSON.parse(localStorage.getItem(+indexNumber))]
            selectedCSVdata.set(dataset[0], dataset.splice(1))
        })
        return selectedCSVdata
    }

    function getAverageOfSelectedData(selectedCSVdata) {
        let data = []
        for (let entrys of selectedCSVdata) {
            let values = entrys[1]
            let averageOfValues = (values.reduce((a, b) => +a + +b))
            averageOfValues = (averageOfValues / values.length).toFixed(2)
            data.push({name: entrys[0], value: averageOfValues})
        }
        return data
    }

    function getModeOfSelectedData(selectedCSVdata) {
        let data = []
        for (let entrys of selectedCSVdata) {
            let values = entrys[1]
            let modeOfValues = (math.mode(values))[0]
            data.push({name: entrys[0], value: modeOfValues})
        }
        return data
    }

    function getMedianOfSelectedData(selectedCSVdata) {
        let data = []
        for (let entrys of selectedCSVdata) {
            let values = entrys[1]
            values = values.map(value => +value)
            let modeOfValues = (math.median(values))
            data.push({name: entrys[0], value: modeOfValues})
        }
        return data
    }

    async function displayGraph(data) {
        electron.createChart(
            document.getElementById('graphCanvas'),
            {
                type: 'bar',
                data: {
                    labels: data.map(row => row.name),
                    datasets: [
                        {
                            data: data.map(row => row.value)
                        }
                    ]
                }
            }
        )
    }
})()