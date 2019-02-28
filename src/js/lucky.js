
(() => {
    new Vue({
        el: '#app',
        data () {
            return {
                head: ["Joe", "Mango", "rea.L", "sarahwang", "Valerie QIU", "代辉", "郝旭亮", "锦鲤本人", "李小朋", "瞿", "文瑞", "昭光", "lutherwan", "Piooo", "Richole", "Suger", "X", "郭郭郭", "贺杰", "褴褛的帆", "欧阳sa", "王大七", "张慢慢，", "赵楠Kevin", "..李甫玉"],
                headImg: {},
                loadIndex: 0,
                result: {},
                isGo: false,
                luckyImg: '',
                luckyname: ''
            }
        },
        mounted () {
            window.verify = this.verify
            this.getAllImgBase64()
        },
        computed: {
            ready () {
                return this.loadIndex === this.head.length
            }
        },
        methods: {
            getBase64ByBlob (Blob) {
                return new Promise (resolve => {
                    let reader = new FileReader()
                    reader.onload = (e) => resolve(e.target.result)
                    reader.readAsDataURL(Blob)
                })
            },
            getAllImg () {
                var arr = []
                this.head.map(item => arr.push(
                    axios.get(`../img/cishi/${item}.jpg`, { responseType: 'blob'}).then(res => res.data)
                ))
                return Promise.all(arr)
            },
            getAllImgBase64 () {
                return this.getAllImg().then((data) => {
                    return data.map((item, index) => {
                        return this.getBase64ByBlob(item).then(base64 => {
                            this.loadIndex++
                            this.headImg[this.head[index]] = base64
                        })
                    })
                })
            },
            getLuckyOne () {
                return this.head[Math.floor(Math.random() *  this.head.length)]
            },
            findLucky () {
                let luckyname = this.getLuckyOne()
                let luckyImg = this.headImg[luckyname]
                if (luckyImg === this.luckyImg) {
                    arguments.callee.apply(this, arguments)
                    return
                } else {
                    this.luckyImg = luckyImg
                    this.luckyname = luckyname
                }
            },
            go () {
                if (this.isGo) {
                    this.isGo = false
                    this.luckyname = ''
                    return
                }
                this.isGo = true
                let allTime = 3000;
                let timer = setInterval(this.findLucky, 100)
                this.findLucky()
                setTimeout(() => {
                    clearInterval(timer)
                }, allTime)
            },
            verify () {
                this.result = {}
                for (let i = 0; i < 30000; i++) {
                    let lucky = this.getLuckyOne()
                    if (this.result[lucky]) {
                        this.result[lucky]++
                    } else {
                        this.result[lucky] = 1
                    }
                }
                console.log(`进行30000次抽奖结果：`)
                console.log(this.result)
            }
        }
    })
})()