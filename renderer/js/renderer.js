const openCSVbutton = document.getElementById("mySidenav").getElementsByTagName("a")[0]
const body = document.getElementsByTagName("body")[0]
const table = document.getElementById("CSVtable")
const mainTabs = document.getElementsByClassName('main')

const topNavBarDataButton = document.getElementById("homeTab")
const topNavBarGraphButton = document.getElementById("graphTab")
const topNavBarAnalysisButton = document.getElementById("analysisTab")

const meanGraphButton = document.getElementById("meanGraphButton")
const modeGraphButton = document.getElementById("modeGraphButton")
const medianGraphButton = document.getElementById("medianGraphButton")
const sideNavButtons = document.getElementById('mySidenav').children

const DELIMITER = ','
const NEWLINE = '\r\n'

let currentCSVdata = new Map()
let cellSelectionIndex = []

//hide all tabs then display the home tab.
let currentTab = mainTabs[0]
for (let tab of mainTabs) { 
  tab.style.display = 'none'
}
currentTab.style.display = 'block'
setSideNavButtonsHome()

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }
  
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.body.style.backgroundColor = "white";
}

//create element for reading files when clicking the "Select CSV" link.
const CSVinput = document.createElement("input");
CSVinput.id = "CSVinput"
CSVinput.style = "opacity: 0"
body.appendChild(CSVinput)
CSVinput.type = "file";

CSVinput.addEventListener("cancel", () => {
  console.log("Cancelled.");
});

CSVinput.addEventListener("change", () => {
  if (CSVinput.files.length == 1) {
    parseCSV(CSVinput.files[0])
  }
});

function parseCSV(file) {
  if (!file || !FileReader) return

  let reader = new FileReader()
  reader.onload = function (file) {
    toTable(file.target.result)
  }

  reader.readAsText(file)
}

function toTable(text) {
  if (!text || !table) return

  //clear table by removing all elements of it untill it has none.
  while (!!table.lastElementChild) {
    table.removeChild(table.lastElementChild)
  }

  let rows = text.split(NEWLINE)
  let headers = rows.shift().split(DELIMITER)
  let headerTableRow = document.createElement('tr')

  let headerIndex = 0
  headers.forEach(name => {
    let tableHeaders = document.createElement('th')
    tableHeaders.className = `col${headerIndex}`
    
    name = name.trim()
    setCSVdata(headerIndex, name)
    headerIndex++
    if (!name) return //full whitespace headers dont get added.

    tableHeaders.textContent = name
    headerTableRow.appendChild(tableHeaders)

  });

  table.appendChild(headerTableRow)

  let tableRows; //non header table rows
  rows.forEach(row => {
    row = row.trim()
    if (!row) return //full whitespace rows dont get added.

    let cols = row.split(DELIMITER)
    if (cols.length === 0) return

    tableRows = document.createElement('tr')

    let colIndex = 0
    cols.forEach(column => {
      let dataCells = document.createElement('td')
      column = column.trim()

      dataCells.textContent = column
      dataCells.className = `col${colIndex}`

      setCSVdata(colIndex, column)
      setColumnEvents(dataCells)

      colIndex++

      tableRows.appendChild(dataCells)
    })

    table.appendChild(tableRows)
  })
}

function setCSVdata(colIndex, column) {
  if (!currentCSVdata.has(colIndex)) currentCSVdata.set(colIndex, []) //if map not made yet for column, make it with an empty array.
  currentCSVdata.get(colIndex).push(column)
}

function setColumnEvents(dataCells) {
  let className = dataCells.className
  let cellElements = document.getElementsByClassName(className)

  dataCells.addEventListener('mouseover', () => {
    for (let cell of cellElements) {
      if (!cellSelectionIndex.includes(className)) cell.style.backgroundColor = "#497ceb"
    }
  })

  dataCells.addEventListener('mouseout', () => {
    for (let cell of cellElements) {
      if (!cellSelectionIndex.includes(className)) cell.style.backgroundColor = ""
    }
  })

  dataCells.addEventListener('click', () => {
    if (cellSelectionIndex.includes(className)) {
      let index = cellSelectionIndex.indexOf(className)
      cellSelectionIndex = (cellSelectionIndex.splice(0,index)).concat(cellSelectionIndex.splice(index+1)) //remove element from array

      for (let cell of cellElements) {
        cell.style.backgroundColor = ""
      }
    } else {
      cellSelectionIndex.push(className)

      for (let cell of cellElements) {
        cell.style.backgroundColor = "#d18f8f"
      }
    }
  })
}

//top nav bar menu buttons to switch tabs.
topNavBarDataButton.addEventListener('click', () => {
  setSideNavButtonsHome()
  currentTab.style.display = 'none'
  currentTab = mainTabs[0]
  currentTab.style.display = 'block'
})

topNavBarGraphButton.addEventListener('click', () => {
  setSideNavButtonsGraph()
  currentTab.style.display = 'none'
  currentTab = mainTabs[1]
  currentTab.style.display = 'block'
})

function setSideNavButtonsHome() {
  //hide all buttons on side nav bar, then display "Select CSV Button only"
  for (let button of sideNavButtons) { 
    button.style.display = 'none'
  }
  sideNavButtons[0].style.display = 'block'
}

function setSideNavButtonsGraph() {
  for (let button of sideNavButtons) { 
    button.style.display = 'none'
  }
  sideNavButtons[1].style.display = 'block' //"mean bar" button
  sideNavButtons[2].style.display = 'block' //"mode bar" button
  sideNavButtons[3].style.display = 'block' //"median bar" button
}

//graphing
meanGraphButton.addEventListener('click', () => {
  let selectedCSVdata = getSelectedCSVdata(cellSelectionIndex)
  let averageData = getAverageOfSelectedData(selectedCSVdata)
  displayGraph(averageData)
})

modeGraphButton.addEventListener('click', () => {
  let selectedCSVdata = getSelectedCSVdata(cellSelectionIndex)
  let modeData = getModeOfSelectedData(selectedCSVdata)
  displayGraph(modeData)
})

medianGraphButton.addEventListener('click', () => {
  let selectedCSVdata = getSelectedCSVdata(cellSelectionIndex)
  let medianData = getMedianOfSelectedData(selectedCSVdata)
  displayGraph(medianData)
})

function getSelectedCSVdata(cellSelectionIndex) {
  let selectedCSVdata = new Map()
  const regex = /col(\d+)/
  cellSelectionIndex.forEach(index => {
    let indexNumber = index.match(regex)[1]
    let dataset = [...currentCSVdata.get(+indexNumber)]
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