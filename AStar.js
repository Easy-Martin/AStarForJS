MAP = {
    ROW: 0,
    COLS: 0,
    ARR: []
}

class Astar {
    constructor(MAP) {
        this.MAP = MAP
    }

    /**
     * 寻路算法
     * @param {number} start_x
     * @param {number} start_y
     * @param {number} end_x
     * @param {number} end_y
     */
    searchRoad(start_x, start_y, end_x, end_y) {
        let openList = [], // 开启列表
            closeList = [], // 关闭列表
            result = [], // 结果数组
            result_index // 结果数组在开启列表中的序号

        openList.push({ row: start_x, col: start_y, G: 0 }) // 把当前点加入到开启列表中，并且G是0

        do {
            let currentPoint = openList.pop()
            closeList.push(currentPoint)
            let surroundPoint = this.getRoundPoint(currentPoint)
            surroundPoint.map(item => {
                if (
                    item.row >= 0 && //判断是否在地图上
                    item.col >= 0 &&
                    item.row < MAP.rows &&
                    item.col < MAP.cols &&
                    this.MAP.arr[item.row][item.col] != 1 && //判断是否是障碍物
                    !this.existList(item, closeList) && //判断是否在关闭列表中
                    this.MAP.arr[item.row][currentPoint.col] != 1 && //判断之间是否有障碍物，如果有障碍物是过不去的
                    this.MAP.arr[currentPoint.row][item.col] != 1
                ) {
                    let g =
                        currentPoint.G +
                        ((currentPoint.row - item.row) *
                            (currentPoint.col - item.col) ==
                        0
                            ? 10
                            : 14)
                    if (!this.existList(item, openList)) {
                        //如果不在开启列表中
                        //计算H，通过水平和垂直距离进行确定
                        item['H'] =
                            Math.abs(end_x - item.row) * 10 +
                            Math.abs(end_y - item.col) * 10
                        item['G'] = g
                        item['F'] = item.H + item.G
                        item['parent'] = currentPoint
                        openList.push(item)
                    } else {
                        //存在在开启列表中，比较目前的g值和之前的g的大小
                        let index = this.existList(item, openList)
                        //如果当前点的g更小
                        if (g < openList[index].G) {
                            openList[index].parent = currentPoint
                            openList[index].G = g
                            openList[index].F = g + openList[index].H
                        }
                    }

                    //判断结果列表是否为空
                    if (!result_index) {
                        result = []
                    } else {
                        let currentObj = openList[result_index]
                        do {
                            //把路劲节点添加到result当中
                            result.unshift({
                                row: currentObj.row,
                                col: currentObj.col
                            })
                            currentObj = currentObj.parent
                        } while (
                            currentObj.row != start_x ||
                            currentObj.col != start_y
                        )
                    }
                    return result
                }
            })

            //如果开启列表空了，没有通路，结果为空
            if (openList.length == 0) {
                break
            }
            openList.sort(this.sortF) //这一步是为了循环回去的时候，找出 F 值最小的, 将它从 "开启列表" 中移掉
        } while (
            !(result_index = this.existList(
                { row: end_x, col: end_y },
                openList
            ))
        )

        //判断结果列表是否为空
        if (!result_index) {
            result = []
        } else {
            let currentObj = openList[result_index]
            do {
                //把路劲节点添加到result当中
                result.unshift({
                    row: currentObj.row,
                    col: currentObj.col
                })
                currentObj = currentObj.parent
            } while (currentObj.row != start_x || currentObj.col != start_y)
        }
        return result
    }

    /**
     * 获取周围八个点的值
     * @param {row,col} curPoint
     */
    getRoundPoint(curPoint) {
        let row = curPoint.row,
            col = curPoint.col
        return [
            { row: row - 1, col: col - 1 },
            { row, col: col - 1 },
            { row: row + 1, col: col - 1 },
            { row: row + 1, col },
            { row: row + 1, col: col + 1 },
            { row, col: col + 1 },
            { row: row - 1, col: col + 1 },
            { row: row - 1, col }
        ]
    }

    /**
     * 判断点是否存在在列表中，是的话返回的是序列号
     * @param {row,col} point
     * @param {Array<{row,col}>} list
     */
    existList(point, list) {
        let index = list.findIndex(
            v => v.row === point.row && v.col === point.col
        )
        return index === -1 ? false : index
    }

    /**
     * 用F值对数组排序
     * @param {object} a
     * @param {object} b
     */
    sortF(a, b) {
        return b.F - a.F
    }
}
