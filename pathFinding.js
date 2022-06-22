


const N = 10;
const nrObstacles = 20;
const start = [0, 0];
const end = [9, 9];

function generateMatrix(size, nrObstacles, start, end) {
    let matrix = []
    for (let i = 0; i < size; i++){
        matrix.push([]);
        for(let j = 0; j < size; j++){
            matrix[i].push(0);
        }
    }

    for(let o = 0; o < nrObstacles; o++){
        let obstacle = generateRandomPosition(size);
        if(matrix[obstacle[0]][obstacle[1]] == 0 && obstacle !== start && obstacle !== end ){
            matrix[obstacle[0]][obstacle[1]] = 1
        }
    }
    

    return matrix
}
function generateRandomPosition(size){
    //the constrains for the generated numbers are 0 and the size of the grid(ex. 10)
    let xPoint = Math.floor(Math.random() * size);
    let yPoint = Math.floor(Math.random() * size);
    return [xPoint, yPoint];
}

function printMatrix(matrix) {

    const print = ((buffer = '') => arg => {
        if (arg !== '\n') {
          buffer += arg
        } else {
          console.log(buffer)
          buffer = ''
        }
      })()

    for (let row of matrix) {
        for (let element of row) {
            print(element + " ")
        }
        print("\n");
    }
}

//the function to flood the initial matrix
function crawl(matrix, distanceMatrix, start, end){
    let queue = [start];
    let theWayBack = generateMatrix(N, 0, start, end);
    theWayBack[start[0]][start[1]] = -1;

    while(queue.length !== 0){
        let currentPosition = queue.shift();
        let neighboursList = findNeighbour(currentPosition);
        for (let neighbour of neighboursList){
            const nextX = neighbour[0];
            const nextY = neighbour[1];

            if( nextX >= 0 && nextX <10 && nextY >= 0 && nextY < 10 && !(nextX === start[0] && nextY === start[1]) ){
                if(matrix[nextX][nextY] !== 1){
                    let d = distanceMatrix[currentPosition[0]][currentPosition[1]];
                    let dNext = distanceMatrix[nextX][nextY];
                    if( dNext === 0){
                        queue.push(neighbour);
                        distanceMatrix[nextX][nextY] = d + 1; 
                        theWayBack[nextX][nextY] = currentPosition;
                    } else if(d + 1 < dNext){
                        theWayBack[nextX][nextY] = currentPosition;
                        distanceMatrix[nextX][nextY] = d + 1;
                        queue.push(neighbour)
                    }

                }
            }
        } 
       
    }

    console.log("Distance matrix is ");
    printMatrix(distanceMatrix);

    console.log("The way back matrix is ");
    printMatrix(theWayBack);

    const finalDistance = distanceMatrix[end[0]][end[1]];

    if (finalDistance == 0) {
        // there is no path
        return []
    }
    let it = end;

    let path = [];
    while(it !== -1 && it !== 0) {
        path.push(it);
        it = theWayBack[it[0]][it[1]];
    }

    return path
}

function findNeighbour(position){
    let neighbour = []
    let x = position[0]
    let y = position [1]
    neighbour.push([x - 1, y - 1],[x - 1, y], [x - 1, y + 1], [x, y - 1], [x, y + 1], [x + 1, y - 1], [x + 1, y], [x + 1, y + 1])
    return neighbour;
}

let readyMatrix = generateMatrix(N, nrObstacles, start, end);
let clearMatrix = generateMatrix(N, 0, start, end);

printMatrix(readyMatrix);

let finalPath = crawl(readyMatrix, clearMatrix, start, end);

console.log(finalPath)