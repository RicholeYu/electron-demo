
(() => {
    const fs = require('fs')
    const path = require('path')
    const { ipcRenderer, shell } = require('electron')
    const spawn = require('child_process').spawn;
    const request = require('request')
    const regedit = require('regedit')
    const autoRunPath = 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run'
    const demo = 'demo'
    window.fs = fs
    window.path = path
    window.request = request
    window.zhuomian = path.resolve(process.env.HOMEDRIVE, process.env.HOMEPATH, 'desktop')
    new Vue({
        el: '#app',
        data () {
            return {
                taskbar: '',
                holder: '',
                tmpfile: '',
                isOver: false,
                error: '很帅',
                application: '',
                link: 'https://www.coinslot.com',
                isFull: false,
                isScroll: false,
                downloadPath: ''
            }
        },
        methods: {
            triggerMenu () {
                ipcRenderer.send('trigger-menu')
            },
            triggerIcon () {
                ipcRenderer.send('trigger-icon')
            },
            triggerTaskBar () {
                ipcRenderer.send('trigger-taskbar')
            },
            triggerFrame () {
                ipcRenderer.send('trigger-frame')
            },
            triggerProgress () {
                ipcRenderer.send('trigger-progress', this.taskbar)
            },
            triggerError () {
                ipcRenderer.send('trigger-error', this.error)
            },
            triggerTop () {
                ipcRenderer.send('trigger-top')
            },
            triggerLink () {
                shell.openExternal(this.link)
            },
            triggerWindow () {
                ipcRenderer.send('trigger-window')
            },
            showRightClickMenu () {
                ipcRenderer.send('trigger-clickmenu')
            },
            holderOver () {
                this.isOver = true
            },
            dragleave () {
                this.isOver = false
            },
            drop () {
                let efile = event.dataTransfer.files[0];
                fs.readFile(efile.path, "utf-8", (err, data) => {
                    if (!err) {
                        this.isOver = false
                        this.holder = data;
                    }
                });
            },
            triggerFile () {
                let filepath = path.resolve(process.env.HOMEDRIVE, process.env.HOMEPATH, 'desktop', '临时文件.txt')
                let ws = fs.createWriteStream(filepath)
                ws.write(this.tmpfile)
                ws.end()
            },
            triggerOpen () {
                let app = spawn(this.application, {
                    detached: true,
                    stdio: 'ignore'
                });
                app.unref()
            },
            triggerFull () {
                this.isFull = !this.isFull
                this.isFull ? window.document.documentElement.webkitRequestFullScreen() : document.webkitCancelFullScreen()
            },
            triggerScroll () {
                this.isScroll = !this.isScroll
                document.body.className = this.isScroll ? 'scroll' : ''
            },
            triggerDevTool () {
                ipcRenderer.send('trigger-dev-tool')
            },
            triggerDownload () {
                let filename = this.downloadPath.split('/')
                filename = filename[filename.length - 1]
                let filepath = path.resolve(process.env.HOMEDRIVE, process.env.HOMEPATH, 'desktop', filename)
                let ws = fs.createWriteStream(filepath)
                request(this.downloadPath).pipe(ws)
                ws.on('close', () => ws.end())
            },
            triggerHide () {
                ipcRenderer.send('trigger-hide')
            },
            triggerLucky () {
                ipcRenderer.send('trigger-lucky')
            },
            triggerReg () {
                regedit.list([autoRunPath], (err, result) => {
                    if (err) {
                        return
                    }
                    let item = result[autoRunPath]
                    if (!item.values.hasOwnProperty(demo)) {
                        this._createAutoStart()
                    }
                })
            },
            _createAutoStart () {
                regedit.putValue({
                    [autoRunPath]: {
                        [demo]: {
                            value: process.execPath,
                            type: 'REG_SZ'
                        }
                    }
                }, function (err) {
                    if (err) {
                        console.log(err)
                    }
                })
            }
        },
        computed: {
            isEmpty () {
                return !this.holder
            },
            holderText () {
                return this.isOver ? '' : this.holder
            }
        }
    })
})()