const openCSVbutton = document.getElementById("mySidenav").getElementsByTagName("a")[0]
const body = document.getElementsByTagName("body")[0]
const table = document.getElementById("CSVtable")

const DELIMITER = ','
const NEWLINE = '\r\n'

/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }
  
/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
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

  headers.forEach(name => {
    let tableHeaders = document.createElement('th')

    name = name.trim()
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

    cols.forEach(column => {
      let dataCells = document.createElement('td')
      column = column.trim()

      dataCells.textContent = column
      tableRows.appendChild(dataCells)
    })

    table.appendChild(tableRows)
  })

}