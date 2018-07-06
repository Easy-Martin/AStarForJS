class ImageMap {
    constructor(imgPath, $el, gridSize = 4) {
        this.$el = $el
        this.gridSize = gridSize
        this.ctx = null
        this.canvas = null
        this.map = {
            rows: 0,
            cols: 0,
            arr: []
        }
        this.fnAreaMove = null
        this.fnMoseDown = null
        this.fnMoseUp = null
        this.imagMap = null
        this.isSetArea = false
        this.isBindEvent = false
        this.startX = 0
        this.startY = 0
        this.step = []
        this.resultMap = { rows: 0, cols: 0, arr: [] }

        this.loadImg(imgPath)
    }
    loadImg(imgPath) {
        let img = new Image()
        img.src = imgPath
        img.onload = () => {
            this.imagMap = img
            this.createContext()
            this.createArrayMap()
            this.resultMap = this.map
            this.step.push(
                {
                    type: 'drawImage',
                    method: () => this.drayImage()
                },
                {
                    type: 'drawGrad',
                    method: () => this.drawGrid()
                }
            )
            this.recoveCtx()
            this.$el.appendChild(this.canvas)
        }
    }
    recoveCtx() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.step.map(item => {
            item.method()
        })
    }
    createContext() {
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.imagMap.width
        this.canvas.height = this.imagMap.height
        this.ctx = this.canvas.getContext('2d')
    }
    createArrayMap() {
        let rowsArr = [],
            colsArr = []
        rowsArr.length = this.map.rows = Math.round(
            this.canvas.height / this.gridSize
        )
        colsArr.length = this.map.cols = Math.round(
            this.canvas.width / this.gridSize
        )
        colsArr.fill(0)
        rowsArr.fill(colsArr)
        this.map.arr = rowsArr
    }
    drayImage() {
        this.ctx.drawImage(
            this.imagMap,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        )
    }
    drawGrid() {
        this.map.arr.map((row, rowIndex) => {
            row.map((col, colIndex) => {
                this.ctx.beginPath()
                if (col === 1) {
                    this.ctx.fillStyle = 'red'
                    this.ctx.fillRect(
                        colIndex * this.gridSize,
                        rowIndex * this.gridSize,
                        this.gridSize,
                        this.gridSize
                    )
                } else {
                    this.ctx.strokeStyle = 'red'
                    this.ctx.lineWidth = 0.2
                    this.ctx.strokeRect(
                        colIndex * this.gridSize,
                        rowIndex * this.gridSize,
                        this.gridSize,
                        this.gridSize
                    )
                }

                this.ctx.closePath()
            })
        })
        this.ctx.save()
        this.setNoGoAreaEvent()
    }
    setNoGoAreaEvent() {
        this.fnMouseMove = event => {
            this.mouseMove(event)
        }

        this.fnMoseUp = event => {
            this.mouseUp(event)
        }

        this.fnMoseDown = event => {
            this.mouseDown(event)
        }

        if (!this.isBindEvent) {
            this.isBindEvent = true
            this.canvas.addEventListener('mousemove', this.fnMouseMove, false)
            this.canvas.addEventListener('mousedown', this.fnMoseDown, false)
            document.body.addEventListener('mouseup', this.fnMoseUp, false)
        }
    }

    setNoAreaScope(startX, startY, endX, endY) {
        let xIndexStart = Math.floor(startX / this.gridSize)
        let xIndexEnd = Math.floor(endX / this.gridSize)
        let yIndexStart = Math.floor(startY / this.gridSize)
        let yIndexEnd = Math.floor(endY / this.gridSize)
        return [xIndexStart, xIndexEnd, yIndexStart, yIndexEnd]
    }

    drawSelectRact(xIndexStart, xIndexEnd, yIndexStart, yIndexEnd, isTemp) {
        this.map.arr.map((row, rowIndex) => {
            if (rowIndex >= yIndexStart && rowIndex <= yIndexEnd) {
                row.map((col, colIndex) => {
                    if (colIndex >= xIndexStart && colIndex <= xIndexEnd) {
                        this.ctx.beginPath()
                        this.ctx.fillStyle = isTemp
                            ? 'rgba(255,0,0,0.5)'
                            : 'red'
                        this.ctx.fillRect(
                            colIndex * this.gridSize,
                            rowIndex * this.gridSize,
                            this.gridSize,
                            this.gridSize
                        )
                        this.setp++
                        this.ctx.closePath()
                    }
                })
            }
        })
    }

    mouseMove(event) {
        if (this.isSetArea) {
            this.endX = event.clientX
            this.endY = event.clientY
            this.recoveCtx()
            let scope = this.setNoAreaScope(
                this.startX,
                this.startY,
                this.endX,
                this.endY
            )
            scope.push(true)
            this.drawSelectRact(...scope)
        }
    }

    mouseUp(event) {
        if (this.isSetArea) {
            this.isSetArea = false

            let scope = this.setNoAreaScope(
                this.startX,
                this.startY,
                this.endX,
                this.endY
            )
            let fn = (function(_self) {
                let arr = [...scope]
                return () => {
                    _self.drawSelectRact(...arr)
                }
            })(this)

            this.step.push({
                type: 'noGoArea',
                method: fn
            })
            this.recoveCtx()
        }
    }
    mouseDown(event) {
        this.isSetArea = true
        this.startX = event.clientX
        this.startY = event.clientY
    }
}
