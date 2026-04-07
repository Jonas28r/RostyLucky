const boardSize = 6
const colors = ["red","yellow","green","blue","purple"]

let board = []
let selected = null

function startCandyGame(){

const boardElement = document.getElementById("board")
boardElement.innerHTML=""

board = []

for(let i=0;i<boardSize;i++){

board[i]=[]

for(let j=0;j<boardSize;j++){

const color = colors[Math.floor(Math.random()*colors.length)]

board[i][j] = color

const div = document.createElement("div")

div.className="candy"

div.style.background=color

div.dataset.row=i
div.dataset.col=j

div.onclick = selectCandy

boardElement.appendChild(div)

}

}

}

function selectCandy(){

const row = parseInt(this.dataset.row)
const col = parseInt(this.dataset.col)

if(!selected){

selected = {row,col}

this.style.border="3px solid white"

return

}

swapCandy(selected.row,selected.col,row,col)

selected=null

renderBoard()

checkMatches()

}

function swapCandy(r1,c1,r2,c2){

const temp = board[r1][c1]

board[r1][c1] = board[r2][c2]

board[r2][c2] = temp

}

function renderBoard(){

const candies = document.querySelectorAll(".candy")

candies.forEach(c=>{

const r=c.dataset.row
const col=c.dataset.col

c.style.background=board[r][col]

c.style.border="none"

})

}

function checkMatches(){

let matches=0

for(let i=0;i<boardSize;i++){

for(let j=0;j<boardSize-2;j++){

if(
board[i][j] === board[i][j+1] &&
board[i][j] === board[i][j+2]
){

matches++

board[i][j] = randomColor()
board[i][j+1] = randomColor()
board[i][j+2] = randomColor()

}

}

}

for(let j=0;j<boardSize;j++){

for(let i=0;i<boardSize-2;i++){

if(
board[i][j] === board[i+1][j] &&
board[i][j] === board[i+2][j]
){

matches++

board[i][j] = randomColor()
board[i+1][j] = randomColor()
board[i+2][j] = randomColor()

}

}

}

if(matches>0){

giveReward(matches)

renderBoard()

}

}

function randomColor(){

return colors[Math.floor(Math.random()*colors.length)]

}

function giveReward(matches){

let energyReward = matches * 0.5

user.energy += energyReward

alert("Ganaste "+energyReward+" energía")

updateUI()

}
