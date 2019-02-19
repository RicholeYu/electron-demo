(() => {
    const fs = require('fs')
    const { ipcRenderer, dialog, shell } = require('electron')
    var app = new Vue({
        el: '#app',
        data () {
            return {
                taskbar: '',
                holder: '',
                isOver: false,
                error: '很帅',
                link: 'https://www.coinslot.com'
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