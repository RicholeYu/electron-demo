(() => {
    const fs = require('fs')
    const { ipcRenderer, dialog, shell } = require('electron')
    var app = new Vue({
        el: '#app',
        data () {
            return {
                taskbar: '',
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
            }
        },
        mounted () {
        }
    })

    var holder = document.getElementById('holder')

    holder.addEventListener("dragenter", function (event) {
        // 重写ondragover 和 ondragenter 使其可放置
        event.preventDefault();
        holder.className = 'holder-ondrag';
        holder.innerText = '请放下您的鼠标';
    });
    
    holder.addEventListener("dragover", function (event) {
        // 重写ondragover 和 ondragenter 使其可放置
        event.preventDefault();
        holder.className = 'holder-ondrag';
        holder.innerText = '请放下您的鼠标';
    });
    
    holder.addEventListener("dragleave", function (event) {
        event.preventDefault();
    
        holder.className = ''
        holder.innerText = '试着拖拽一些文件到这';
    });
    
    holder.addEventListener("drop", function (event) {
        // 调用 preventDefault() 来避免浏览器对数据的默认处理（drop 事件的默认行为是以链接形式打开） 
        event.preventDefault();
    
        // 原生语句如下，但引进jquery后要更改
        // var file=event.dataTransfer.files[0];
        // 原因：
        // 在jquery中，最终传入事件处理程序的 event 其实已经被 jQuery 做过标准化处理，
        // 其原有的事件对象则被保存于 event 对象的 originalEvent 属性之中，
        // 每个 event 都是 jQuery.Event 的实例
        // 应该这样写:
        var efile = event.dataTransfer.files[0];
    
        holder.className = "holder-ondrag";
    
        fs.readFile(efile.path, "utf8", function(err, data){
            if (err) {
                throw err;
                return
            }
            holder.innerText = data;
        });
        return false;
    });
})()