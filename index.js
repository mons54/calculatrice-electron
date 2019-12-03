const { app, BrowserWindow, Menu } = require('electron')

require('electron-reload')(__dirname);

Menu.setApplicationMenu(null);

let win

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: "Calculatrice de la mort qui tue !",
    autoHideMenuBar: false
  })

  win.removeMenu()

  win.loadFile('index.html')

  win.webContents.openDevTools()

  win.on('page-title-updated', (e) => {
    e.preventDefault();
  })

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})
