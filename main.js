const { app, BrowserWindow, Menu, ipcMain, Tray, dialog, MenuItem, shell } = require('electron')
const request = require('request')
const menu = require('./main/menu')
const path = require('path')
var menuList = menu.menu
var isOpenMenu = false
var isOpenIcon = false
var isMessage = false
var isShowTaskBar = true
var isShowFrame = true
var isShowProgress = true
var isShowTop = true
var timer = null
var appTray= null

console.log(process.pid)

function createIndexWindow() {
    const BASE_URL = path.resolve(__dirname, 'src/view/index.html')

    // 初始化窗体
    win = new BrowserWindow({
        width: 600,
        height: 600
    })
    win.setMenu(null)
    
    win.openDevTools()

    // 加载index.html
    win.loadFile(BASE_URL)

    win.on('closed', () => {
        process.exit(0)
        if (appTray) {
            appTray.destroy()
        }
    })
}

function createMessageWindow() {
    const BASE_URL = path.resolve(__dirname, 'src/view/message.html')

    // 初始化窗体
    messageWin = new BrowserWindow({
        width: 400,
        height: 400,
        show: false
    })
    messageWin.setMenu(null)

    // 加载index.html
    messageWin.loadFile(BASE_URL)

    messageWin.show()
}

function createTray () {
    if (appTray) {
        appTray.destroy()
    }
    appTray = new Tray(path.resolve(__dirname, 'coinslot.ico'))
    appTray.setToolTip('demo')
    appTray.on('click', () => {
        if (isMessage) {
            isMessage = false
            clearInterval(timer)
            timer = null
            createMessageWindow()
            appTray.setImage(path.resolve(__dirname, 'coinslot.ico'))
            appTray.setToolTip('demo')
        }
    })
    appTray.setContextMenu(menu.iconMenu(() => {
        isMessage = true
        let isWanzong = true
        appTray.setToolTip('1条万总的未读消息')
        timer = setInterval(() => {
            appTray.setImage(path.resolve(__dirname, isWanzong ? 'wanzong.ico' : 'coinslot.ico'))
            isWanzong = !isWanzong
        }, 800)
    }))
}

function createClickMenu () {
    const menu = new Menu()
    menu.append(new MenuItem({
        label: 'Coinslot',
        click () {
            shell.openExternal('https://www.coinslot.com')
        }
    }))
    menu.popup(win)
}

function createWindow () {

    createIndexWindow()

    // 控制窗体菜单
    ipcMain.on('trigger-menu', () => {
        win.setMenu(isOpenMenu ? null : menuList)
        isOpenMenu = !isOpenMenu
    })

    ipcMain.on('trigger-icon', () => {
        if (isOpenIcon) {
            appTray.destroy()
        } else {
            createTray()
        }
        isOpenIcon = !isOpenIcon
    })

    ipcMain.on('trigger-taskbar', () => {
        win.setSkipTaskbar(isShowTaskBar)
        isShowTaskBar = !isShowTaskBar
    })

    ipcMain.on('trigger-frame', () => {
        win.flashFrame(isShowFrame)
        isShowFrame = !isShowFrame
    })

    ipcMain.on('trigger-progress', (e, val) => {
        if (isShowProgress) {
            win.setProgressBar(val === '' ? 2 : parseFloat(val))
        } else {
            win.setProgressBar(0)
        }
        isShowProgress = !isShowProgress
    })

    ipcMain.on('trigger-top', () => {
        win.setAlwaysOnTop(isShowTop)
        isShowTop = !isShowTop
    })

    ipcMain.on('trigger-error', (e, message) => {
        dialog.showErrorBox('Rich 老师', message)
    })
    
    ipcMain.on('trigger-window', () => {
        const BASE_URL = path.resolve(__dirname, 'src/view/new.html')

        // 初始化窗体
        let win = new BrowserWindow({
            width: 400,
            height: 400
        })
        win.setMenu(null)
    
        // 加载index.html
        win.loadFile(BASE_URL)
    })

    ipcMain.on('trigger-clickmenu', () => {
        createClickMenu()
    })

    ipcMain.on('trigger-dev-tool', () => {
        win.openDevTools()
    })

    ipcMain.on('trigger-hide', () => {
        let isD = false
        win.hide()
        if (appTray) {
            isD = true
            appTray.destroy()
        }
        setTimeout(() => {
            win.show()
            if (isD) {
                createTray()
            }
        }, 10000)
    })

    ipcMain.on('trigger-lucky', () => {
        const BASE_URL = path.resolve(__dirname, 'src/view/lucky.html')

        // 初始化窗体
        let win = new BrowserWindow({
            width: 400,
            height: 400
        })
        win.setMenu(null)

        // 加载index.html
        win.loadFile(BASE_URL)

        win.openDevTools()
    })
}

app.on('ready', () => {
    createWindow()
    try {
        BrowserWindow.addDevToolsExtension(
            path.resolve('C:\\Users\\Administrator\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\nhdogjmejiglipccpnnnanhbledajbpd\\4.1.5_0')
        )
    } catch (e) {
        console.log(e)
    }
})

// dialog.showErrorBox('result', `${request.url.indexOf('index.html') > -1 ? '1' : '0'} | ${request.url}`)