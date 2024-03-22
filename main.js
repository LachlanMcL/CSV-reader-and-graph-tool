const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const isMac = process.platform === 'darwin'

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: "csv-reader-and-graph-tool",
        width: 1500,
        height: 1000,
    })

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'))
}

app.whenReady().then(() => {
    createMainWindow()

    //remove main window from memory on close
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow()
        }
    })


})

//depending on system, app will close differently.
app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit()
    }
})