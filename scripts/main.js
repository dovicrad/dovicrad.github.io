import {Minesweeper} from "./Minesweeper.js";
import {Modal} from "./Modal.js";
import {Timer} from "./Timer.js";
import {Leaderboard} from "./Leaderboard.js";

const modal = new Modal()
const timer = new Timer()
const leaderboard = new Leaderboard()

const game = new Minesweeper(modal, timer,leaderboard)

// Getting containers
const gameContainer = document.querySelector("#gameContainer")
const gameElement = document.querySelector("#game")

const form = document.getElementById("optionForm");


// Handle size submit
form.addEventListener("submit", function (event) {
    event.preventDefault()
    const selectedOption = document.querySelector('input[name="option"]:checked');

    let size = 25
    switch (selectedOption.value){
        case "option1":
            size = 10
            break
        case "option2":
            size = 20
            break
        case "option3":
            size = 30
            break
    }
    
    // Setup and display the game
    const bombs = Math.floor((size*size)/8)
    game.setup(bombs,size)
    
    gameContainer.innerHTML = ""
    
    gameContainer.appendChild(game.getElement())
    gameElement.appendChild(leaderboard.getElement(size))
    gameElement.appendChild(modal.getElement())

    // Hide form display game
    document.querySelector("#sizeSelection").style.display = "none"
    gameElement.style.display = "block"
})
