const canvas = document.getElementById('cnv');
const ctx = canvas.getContext('2d');

ctx.translate(canvas.width/2,canvas.height/2)
ctx.rotate(Math.PI*2)
ctx.translate(-canvas.width/2,-canvas.height/2)
ctx.translate(0.5,0.5)

let grid =20
const cellSize = (canvas.width-2)/grid;
var sx = 0,sy=0;

class player{
    constructor(){
        this.i=0
        this.j=0
        this.size=cellSize
        this.color="red"
        this.trail=[]
        this.traillength=10
    }
    draw(){
        ctx.fillStyle=this.color
        ctx.fillRect(this.size/4+this.j*this.size,this.size/4+this.i*this.size,this.size/2,this.size/2)
    }
    update(){
        
        this.drawtrail()
        this.draw()
        if(this.trail.length>this.traillength){
            this.trail.shift()
        }
    }
    drawtrail(){
        
        this.trail.forEach((t)=>{
            ctx.fillStyle="hsla("+10*(this.trail.length-this.trail.indexOf(t))+",100%,50%,70%)"
            ctx.fillRect(this.size/4+t.j*this.size,this.size/4+t.i*this.size,this.size/2,this.size/2)
        })
    }
    up(){
        if(!maze[this.i][this.j].top){
            this.i--
            this.trail.push({i:this.i,j:this.j})
        }
    }
    down(){
        if(!maze[this.i][this.j].bottom){
            this.i++
            this.trail.push({i:this.i,j:this.j})
        }
    }
    left(){
        if(!maze[this.i][this.j].left){
            this.j--
            this.trail.push({i:this.i,j:this.j})
        }
    }
    right(){
        if(!maze[this.i][this.j].right){
            this.j++
            this.trail.push({i:this.i,j:this.j})
        }
    }
}

function initMaze(rows, cols) {
    const maze = [];
    for (let i = 0; i < rows; i++) {
        maze[i] = [];
        for (let j = 0; j < cols; j++) {
            maze[i][j] = {
                i:i,
                j:j,
                top:true,
                bottom:true,
                left:true,
                right:true,
                visited:false,
                visitedp:false,
                path:false,
                dp:""
            }
        }
    }
    return maze;
}


function drawMaze(maze) {
    
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j].top) {
                ctx.fillStyle="black"
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, 1);
            }
            if (maze[i][j].bottom) {
                ctx.fillStyle="black"
                ctx.fillRect(j * cellSize, (i+1) * cellSize, cellSize, 1);
            }
            if (maze[i][j].left) {
                ctx.fillStyle="black"
                ctx.fillRect(j * cellSize, i * cellSize,1, cellSize);
            }
            if (maze[i][j].right) {
                ctx.fillStyle="black"
                ctx.fillRect((j+1) * cellSize, i * cellSize,1, cellSize);
            }
        }
    }
}

function genrateMaze(maze,i,j){
    maze[i][j].visited=true
    let neighbour = getunvisited(maze,i,j)
    while(neighbour.length>0){
        let n = neighbour[Math.floor(Math.random()*neighbour.length)]
        
        if(i==n.i&&j>n.j){
            maze[i][j].left=false
            maze[n.i][n.j].right=false
            genrateMaze(maze,n.i,n.j)
        }
        if(i==n.i&&j<n.j){
            maze[i][j].right=false
            maze[n.i][n.j].left=false
            genrateMaze(maze,n.i,n.j)    
        }
        if(j==n.j&&i<n.i){
            maze[i][j].bottom=false
            maze[n.i][n.j].top=false
            genrateMaze(maze,n.i,n.j)
        }
        if(j==n.j&&i>n.i){
            maze[i][j].top=false
            maze[n.i][n.j].bottom=false
            genrateMaze(maze,n.i,n.j)      
        }
        neighbour= getunvisited(maze,i,j)
    }
}


function getunvisited(maze,i,j){
    let n = []
    if(i>0){
        if(!maze[i-1][j].visited){
            n.push({i:i-1,j:j})
        }
    }
    if(i<grid-1){
        if(!maze[i+1][j].visited){
            n.push({i:i+1,j:j})
        }
    }
    if(j>0){
        if(!maze[i][j-1].visited){
            n.push({i:i,j:j-1})
        }
    }
    if(j<grid-1){
        if(!maze[i][j+1].visited){
            n.push({i:i,j:j+1})
        }
    }
    return n;
}

let pfound=false
function findsol(maze,i,j){
    maze[i][j].path=true
    
    if(i==sx&&j==sy){
        pfound=true
        return true;
    }
    if(!maze[i][j].top&&!maze[i-1][j].visitedp&&!pfound){
        maze[i][j].dp="top"
        maze[i][j].visitedp=true
        if(!findsol(maze,i-1,j)){
            maze[i-1][j].path=false
        }
        
    }
    if(!maze[i][j].bottom&&!maze[i+1][j].visitedp&&!pfound){
        maze[i][j].dp="bottom"
        maze[i][j].visitedp=true
        if(!findsol(maze,i+1,j)){
            maze[i+1][j].path=false 
        }
        
    }
    if(!maze[i][j].right&&!maze[i][j+1].visitedp&&!pfound){
        maze[i][j].dp="right"
        maze[i][j].visitedp=true
        if(!findsol(maze,i,j+1)){
            maze[i][j+1].path=false
        }
    }
    if(!maze[i][j].left&&!maze[i][j-1].visitedp&&!pfound){
        maze[i][j].dp="left"
        maze[i][j].visitedp=true
        if(!findsol(maze,i,j-1)){
            maze[i][j-1].path=false   
        }
    }
    return pfound
}


function drawsol(maze) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze(maze);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 2;
    ctx.linecap = 'round';
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j].path) {
                const x = j * cellSize + cellSize / 2;
                const y = i * cellSize + cellSize / 2;
                ctx.beginPath();
                switch (maze[i][j].dp) {
                    case 'top':
                        ctx.moveTo(x, y);
                        ctx.lineTo(x, y - cellSize);
                        break;
                    case 'right':
                        ctx.moveTo(x, y);
                        ctx.lineTo(x + cellSize , y);
                        break;
                    case 'bottom':
                        ctx.moveTo(x, y);
                        ctx.lineTo(x, y + cellSize);
                        break;
                    case 'left':
                        ctx.moveTo(x, y);
                        ctx.lineTo(x - cellSize, y);
                        break;
                }
                ctx.stroke();
            }
        }
    }
    
}
function setunpath(maze){
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            maze[i][j].visitedp=false
            maze[i][j].path=false
        }
    }
    pfound=false
}
let fclick = false
canvas.onclick=(e)=>{
    let i = Math.floor(e.offsetY/cellSize)
    let j = Math.floor(e.offsetX/cellSize)
    
    if(!fclick){
        sx=i
        sy=j
        p.i=i
        p.j=j
    }    
    if(fclick&&!solve){
        findsol(maze,i,j)
    }
    fclick=true   
}
let solve=false
window.onkeydown=(e)=>{
    if(e.keyCode==32){
        solve = !solve
    }
    if(!solve){
        setunpath(maze)
        p.trail=[]
        fclick=false
    }
    if(e.keyCode==37||e.key=="a"){
        p.left()
    }
    if(e.keyCode==38||e.key=="w"){
        p.up()
    }
    if(e.keyCode==39||e.key=="d"){
        p.right()
    }
    if(e.keyCode==40||e.key=="s"){
        p.down()
    }
}

alert("first click to set start point and second click to set end point and use arrow keys to move the red block to the end point and if you stuck press space to see the path and for restart press space again")
const maze = initMaze(grid,grid);
genrateMaze(maze,sy,sx)
var p = new player()
function gameLoop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze(maze);
    if(solve){
        drawsol(maze)
    }
    p.update()
    requestAnimationFrame(gameLoop)
}
gameLoop()
drawMaze(maze);


