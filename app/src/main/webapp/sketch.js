
var data = {fill:255,owner:255,atoms:0};
var grid = new Array(15);
    for (let i = 0; i < grid.length; i++) {
        grid[i] = new Array(15);
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j] = JSON.parse(JSON.stringify(data));
            
        }
    }
var num = 5;
var gameOverVal = false;
var cell_count = -1;
var flag = false;
var owner;
function setup() {
    createCanvas(600, 600);
    frameRate(60);
    gr = color(0,255,0);
    re = color(255,0,0);
    bl = color(0,0,255);
    pr = color(252,3,252);
    pi = color(252,3,165);
    ye = color(240,252,3);
}
function draw() {
    if(num < 35 && !flag)
        num += 0.5;
    else{
        flag = true;
    }
    if(flag){
        num-=0.5;
    }
    if(num === 5 && flag){
        flag = false;
    }
    for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
            fill(grid[i][j].fill);
            rect(i*40,j*40,40,40);
            fill(grid[i][j].owner);
            switch(grid[i][j].atoms){
                case(1):
                    circle(i*40 + num,j*40+ num,10);
                    break;
                case(2):
                    circle(i*40 + num,j*40+ num,10);
                    circle((i+1)*40 - num,(j+1)*40 - num,10);
                    break;
                case(3):
                    circle(i*40 + num,j*40+ num,10);
                    circle((i+1)*40 - num,(j+1)*40 - num,10);
                    circle(i*40 + 20,j*40 + 20,10);
                    break;
                default:
                    break;
            }
        }
    }
  }
function expandReaction(i,j,color){
    if(i<0 || j<0 ||  i>=15 || j>=15 )
        return;
    var count = grid[i][j].atoms;
    if(grid[i][j].owner !== color && color === getMyCol(myColor)){
        if(cell_count === -1){
            cell_count = 1;
        }
        else
            cell_count++;
    }
    if(grid[i][j].owner === getMyCol(myColor) && color!== getMyCol(myColor)){
        cell_count--;
        console.log(cell_count);
        if(cell_count === 0){
            gameOver();
            gameOverVal= true;
        }
    }
    var thresh;
    if((i == 0 && j == 0) || (i == 14 && j == 0) ||(i == 0 && j == 14) || (i == 14 && j == 14)){
        thresh = 2;
    }else if(i == 0 || j == 0 || i== 14 || j == 14){
        thresh = 3;
    }else{
        thresh = 4;
    }
    if(count+1 < thresh){
        console.log(thresh+" "+i+" "+j+" "+count);
        grid[i][j].atoms++;
        grid[i][j].owner = color;
    }else{
        count = 0;
        grid[i][j].atoms = 0;
        grid[i][j].owner = color;
        expandReaction(i+1,j,color);
        expandReaction(i-1,j,color);
        expandReaction(i,j+1,color);
        expandReaction(i,j-1,color);
    }
    
}
function mousePressed(){
    if(mouseX<600 && mouseY<600 && !gameOverVal){
        let i = Math.floor(mouseX/40);
        let j = Math.floor(mouseY/40);
        if(grid[i][j].owner == owner || grid[i][j].owner === 255){
            gameMove(i,j)
            //expandReaction(i,j,owner);
        }
    }
}
function callConn(){
    console.log("called");
}
function getRed(){
    return re;
}
function getBlue(){
    return bl;
}
function getGreen(){
    return gr;
}
function getPurple(){
    return pr;
}
function getPink(){
    return pi;
}
function getYellow(){
    return ye;
}
function setOwner(color){
    owner = getMyCol(color);
    console.log(owner);
}