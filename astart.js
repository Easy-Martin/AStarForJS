const MAP = {
    rows: 20,
    cols: 20,
    arr: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
}
//其中的MAP.arr是二维数组
function searchRoad(start_x, start_y, end_x, end_y) {
    var openList = [], //开启列表
        closeList = [], //关闭列表
        result = [], //结果数组
        result_index //结果数组在开启列表中的序号

    openList.push({ x: start_x, y: start_y, G: 0 }) //把当前点加入到开启列表中，并且G是0
    do {
        
        var currentPoint = openList.pop()
        closeList.push(currentPoint)
        var surroundPoint = SurroundPoint(currentPoint)
        for (var i in surroundPoint) {
            var item = surroundPoint[i] //获得周围的八个点
            //console.log(item.x,item.y)
            if (
                item.x >= 0 && //判断是否在地图上
                item.y >= 0 &&
                item.x < MAP.rows &&
                item.y < MAP.cols &&
                MAP.arr[item.x][item.y] != 1 && //判断是否是障碍物
                !existList(item, closeList) && //判断是否在关闭列表中
                MAP.arr[item.x][currentPoint.y] != 1 && //判断之间是否有障碍物，如果有障碍物是过不去的
                MAP.arr[currentPoint.x][item.y] != 1
            ) {
                //g 到父节点的位置
                //如果是上下左右位置的则g等于10，斜对角的就是14
                var g =
                    currentPoint.G +
                    ((currentPoint.x - item.x) * (currentPoint.y - item.y) == 0
                        ? 10
                        : 14)
                if (!existList(item, openList)) {
                    //如果不在开启列表中
                    //计算H，通过水平和垂直距离进行确定
                    item['H'] =
                        Math.abs(end_x - item.x) * 10 +
                        Math.abs(end_y - item.y) * 10
                    item['G'] = g
                    item['F'] = item.H + item.G
                    item['parent'] = currentPoint
                    openList.push(item)
                } else {
                    //存在在开启列表中，比较目前的g值和之前的g的大小
                    var index = existList(item, openList)
                    //如果当前点的g更小
                    if (g < openList[index].G) {
                        openList[index].parent = currentPoint
                        openList[index].G = g
                        openList[index].F = g + openList[index].H
                    }
                }
            }
        }
        //如果开启列表空了，没有通路，结果为空
        if (openList.length == 0) {
            break
        }
        openList.sort(sortF) //这一步是为了循环回去的时候，找出 F 值最小的, 将它从 "开启列表" 中移掉
    } while (!(result_index = existList({ x: end_x, y: end_y }, openList)))

    //判断结果列表是否为空
    if (!result_index) {
        result = []
    } else {
        var currentObj = openList[result_index]
        do {
            //把路劲节点添加到result当中
            result.unshift({
                x: currentObj.x,
                y: currentObj.y
            })
            currentObj = currentObj.parent
        } while (currentObj.x != start_x || currentObj.y != start_y)
    }
    return result
}
//用F值对数组排序
function sortF(a, b) {
    return b.F - a.F
}
//获取周围八个点的值
function SurroundPoint(curPoint) {
    var x = curPoint.x,
        y = curPoint.y
    return [
        { x: x - 1, y: y - 1 },
        { x: x, y: y - 1 },
        { x: x + 1, y: y - 1 },
        { x: x + 1, y: y },
        { x: x + 1, y: y + 1 },
        { x: x, y: y + 1 },
        { x: x - 1, y: y + 1 },
        { x: x - 1, y: y }
    ]
}
//判断点是否存在在列表中，是的话返回的是序列号
function existList(point, list) {
    for (var i in list) {
        if (point.x == list[i].x && point.y == list[i].y) {
            return i
        }
    }
    return false
}

const startPoint = [8, 8]
const endPoint = [13, 12]

function createMap() {
    const SIZE = 20
    MAP.arr.map((colsItems, index) => {
        let oUl = document.createElement('ul')
        oUl.index = index
        document.body.appendChild(oUl)
        colsItems.map((item, index2) => {
            let oLi = document.createElement('li')
            oLi.index = index2
            oLi.style.width = SIZE + 'px'
            oLi.style.height = SIZE + 'px'
            if (item == 1) {
                oLi.className = 'style1'
            } else {
                oLi.className = 'style2'
            }
            oUl.appendChild(oLi)
        })
    })
}
createMap()
let uls = document.querySelectorAll('ul')
Array.from(uls).map(item => {
    item.lis = item.querySelectorAll('li')
})

let startItem = uls[startPoint[0]].lis[startPoint[1]]
startItem.className = 'style3'
let endItem = uls[endPoint[0]].lis[endPoint[1]]
endItem.className = 'style4'

let btn = document.querySelector('#btn')
let start = new Astar(MAP)
btn.onclick = () => {
    let result = start.searchRoad(...startPoint, ...endPoint)
    result.map((item, index) => {
        if (index !== result.length - 1) {
            uls[item.row].lis[item.col].className = 'style5'
        }
    })
    console.log(result)
}
