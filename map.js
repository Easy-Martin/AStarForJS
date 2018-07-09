class ImageMap {
    constructor(imgPath, $el, gridSize = 50) {
        this.$el = $el;
        this.gridSize = gridSize;
        this.imgPath = imgPath;
        this.ctx = null;
        this.canvas = null;
        this.map = { rows: 0, cols: 0, arr: [] };
        this.resultMap = { rows: 0, cols: 0, arr: [] };
        this.fnAreaMove = null;
        this.fnMoseDown = null;
        this.fnMoseUp = null;
        this.imagMap = null;
        this.isSetArea = false;
        this.isBindEvent = false;
        this.startX = 0;
        this.startY = 0;
        this.step = [];
    }

    /**
     * 初始化
     */
    init() {
        return this.createImageMapLayer().then(() => {
            this.saveDefaultStep();
            this.recoveCtx();
            this.resultMap = JSON.parse(JSON.stringify(this.map));
        });
    }

    /**
     * 创建图片地图
     */
    createImageMapLayer() {
        let img = new Image();
        img.src = this.imgPath;
        return new Promise((resolve, reject) => {
            img.onload = () => {
                this.imagMap = img;
                this.createContext();
                this.createArrayMap();
                this.$el.appendChild(this.canvas);
                resolve();
            };
            img.onerror = error => {
                reject(error);
            };
        });
    }

    /**
     * 保存基本canvas快照
     */
    saveDefaultStep() {
        this.step.push(
            {
                type: "drawImage",
                method: () => this.drayImage()
            },
            {
                type: "drawGrad",
                method: () => this.drawGrid()
            }
        );
    }

    /**
     * 还原canvas快照
     */
    recoveCtx() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.step.map(item => {
            item.method();
        });
    }

    /**
     * 创建canvas对象
     */
    createContext() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.imagMap.width;
        this.canvas.height = this.imagMap.height;
        this.ctx = this.canvas.getContext("2d");
    }

    /**
     * 创建数组地图对于canvas的网格
     */
    createArrayMap() {
        let rowsSize = (this.map.rows = Math.round(
            this.canvas.height / this.gridSize
        ));
        let colsSize = (this.map.cols = Math.round(
            this.canvas.width / this.gridSize
        ));
        for (let i = 0; i < rowsSize; i++) {
            this.map.arr[i] = [];
            for (let j = 0; j < colsSize; j++) {
                this.map.arr[i].push(0);
            }
        }
    }

    /**
     * 绘制图片到canvas
     */
    drayImage() {
        this.ctx.drawImage(
            this.imagMap,
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }

    /**
     * 绘制网格到canvas
     */
    drawGrid() {
        this.map.arr.map((row, rowIndex) => {
            row.map((col, colIndex) => {
                this.ctx.beginPath();
                if (col === 1) {
                    this.ctx.fillStyle = "red";
                    this.ctx.fillRect(
                        colIndex * this.gridSize,
                        rowIndex * this.gridSize,
                        this.gridSize,
                        this.gridSize
                    );
                } else {
                    this.ctx.strokeStyle = "red";
                    this.ctx.lineWidth = 0.2;
                    this.ctx.strokeRect(
                        colIndex * this.gridSize,
                        rowIndex * this.gridSize,
                        this.gridSize,
                        this.gridSize
                    );
                }

                this.ctx.closePath();
            });
        });
    }

    /**
     * 开启设置地图禁区
     */
    setNoGoAreaEvent() {
        this.fnMouseMove = event => {
            this.mouseMove(event);
        };

        this.fnMouseOut = event => {
            this.mouseOut(event);
        };

        this.fnMoseUp = event => {
            this.mouseUp(event);
        };

        this.fnMoseDown = event => {
            this.mouseDown(event);
        };

        if (!this.isBindEvent) {
            this.isBindEvent = true;
            this.canvas.addEventListener("mousemove", this.fnMouseMove, false);
            this.canvas.addEventListener("mouseout", this.fnMouseOut, false);
            this.canvas.addEventListener("mousedown", this.fnMoseDown, false);
            this.canvas.addEventListener("mouseup", this.fnMoseUp, false);
        }
    }

    /**
     * 获取绘制禁区的范围
     * @param {number} startX
     * @param {number} startY
     * @param {number} endX
     * @param {number} endY
     */
    setNoAreaScope(startX, startY, endX, endY) {
        let xIndexStart = Math.floor(startX / this.gridSize);
        let xIndexEnd = Math.floor(endX / this.gridSize);
        let yIndexStart = Math.floor(startY / this.gridSize);
        let yIndexEnd = Math.floor(endY / this.gridSize);
        let x, x1, y, y1;
        if (xIndexStart < xIndexEnd) {
            x = xIndexStart;
            x1 = xIndexEnd;
        } else {
            x1 = xIndexStart;
            x = xIndexEnd;
        }
        if (yIndexStart < yIndexEnd) {
            y = yIndexStart;
            y1 = yIndexEnd;
        } else {
            y1 = yIndexStart;
            y = yIndexEnd;
        }
        return [x, x1, y, y1];
    }

    /**
     * 绘制禁区的方法
     * @param {number} xIndexStart
     * @param {number} xIndexEnd
     * @param {number} yIndexStart
     * @param {number} yIndexEnd
     * @param {number} isTemp
     */
    drawSelectRact(xIndexStart, xIndexEnd, yIndexStart, yIndexEnd, isTemp) {
        this.map.arr.map((row, rowIndex) => {
            if (rowIndex >= yIndexStart && rowIndex <= yIndexEnd) {
                row.map((col, colIndex) => {
                    if (colIndex >= xIndexStart && colIndex <= xIndexEnd) {
                        this.ctx.beginPath();
                        this.ctx.fillStyle = isTemp
                            ? "rgba(255,0,0,0.5)"
                            : "red";
                        this.ctx.fillRect(
                            colIndex * this.gridSize,
                            rowIndex * this.gridSize,
                            this.gridSize,
                            this.gridSize
                        );
                        this.ctx.closePath();
                    }
                });
            }
        });
    }

    /**
     * 设置禁区后保存数组地图到resultMap对象上
     * @param {number} xIndexStart
     * @param {number} xIndexEnd
     * @param {number} yIndexStart
     * @param {number} yIndexEnd
     */
    setResultMap(xIndexStart, xIndexEnd, yIndexStart, yIndexEnd) {
        for (let i = 0; i < this.resultMap.arr.length; i++) {
            if (i >= yIndexStart && i <= yIndexEnd) {
                let row = this.resultMap.arr[i];
                for (let j = 0; j < row.length; j++) {
                    if (j >= xIndexStart && j <= xIndexEnd) {
                        this.resultMap.arr[i][j] = 1;
                    }
                }
            }
        }
    }

    /**
     * 用于绘制禁区储存坐标
     * @param {Event} event
     */
    mouseMove(event) {
        if (this.isSetArea) {
            this.endX = event.clientX;
            this.endY = event.clientY;
            this.recoveCtx();
            let scope = this.setNoAreaScope(
                this.startX,
                this.startY,
                this.endX,
                this.endY
            );
            scope.push(true);
            this.drawSelectRact(...scope);
        }
    }

    mouseOut(event) {
        if (this.isSetArea) {
            this.mouseUp(event)
        }
    }

    /**
     * 确认绘制禁区保存快照，更新resultMap
     * @param {Event} event
     */
    mouseUp(event) {
        if (this.isSetArea) {
            this.isSetArea = false;

            let scope = this.setNoAreaScope(
                this.startX,
                this.startY,
                event.clientX,
                event.clientY
            );
            this.setResultMap(...scope);
            let fn = (function(_self) {
                let arr = [...scope];
                return () => {
                    _self.drawSelectRact(...arr);
                };
            })(this);

            this.step.push({
                type: "noGoArea",
                method: fn
            });
            this.recoveCtx();
        }
    }

    /**
     * 开启绘制禁区
     * @param {Event} event
     */
    mouseDown(event) {
        this.isSetArea = true;
        this.startX = event.clientX;
        this.startY = event.clientY;
    }
}
