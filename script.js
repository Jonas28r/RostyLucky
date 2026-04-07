const tg = window.Telegram.WebApp
const userId = tg.initDataUnsafe.user.id

const API = "https://TU_BACKEND_URL"

let user = null

async function login(){

const res = await fetch(API+"/login",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({user_id:userId})
})

user = await res.json()

updateUI()

}

function updateUI(){

document.getElementById("balance").innerText = user.balance.toFixed(6)
document.getElementById("energy").innerText = user.energy

}

async function tap(){

const res = await fetch(API+"/tap",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({user_id:userId})

})

user = await res.json()

updateUI()

}

async function spin(){

const res = await fetch(API+"/spin",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({user_id:userId})

})

const data = await res.json()

user = data.user

alert("Ganaste: "+data.reward.type)

updateUI()

}

async function startMining(){

window.open("ADSTERRA_LINK","_blank")

await fetch(API+"/startMining",{

method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({user_id:userId})

})

}

login()

generateCandy()

function generateCandy(){

const colors = ["red","yellow","green","blue","purple"]

const board = document.getElementById("board")

for(let i=0;i<36;i++){

const div = document.createElement("div")

div.className = "candy"

div.style.background = colors[Math.floor(Math.random()*colors.length)]

div.onclick = ()=>{

user.energy += 0.1
updateUI()

}

board.appendChild(div)

}

}
