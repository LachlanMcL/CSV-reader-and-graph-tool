const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

const isMac = process.platform === 'darwin'

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: "Image Resizer",
        width: 1500,
        height: 1000,
    })

    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'))
}

app.whenReady().then(() => {
    createMainWindow()

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