export class Modal{
    constructor() {
        this.element = this.buildElement()
        this.element.addEventListener("contextmenu", this)
        this.winMessage = this.element.querySelector("div #W")
        this.loseMessage = this.element.querySelector("div #L")

        this.game = null
    }

    buildElement() {
        const container = document.createElement("div")
        container.setAttribute("id", "modal")
        container.innerHTML = "" +
            "<div id=\"modalContent\">" +
            "   <div>" +
            "       <div id='L'>You lost !</div>" +
            "       <div id='W'>You won !</div>" +

            "   </div>" +
            "   <div>" +
            "       <button type='button' id='replayButton'>Play again</button>" +
            "       <button type='button' id='changeSizeButton'>Change size</button>" +
            "   </div>"+
            "</div>"
        const replayButton = container.querySelector("#replayButton")
        replayButton.addEventListener("click",this.replay.bind(this))

        const changeSizeButton = container.querySelector("#changeSizeButton")
        changeSizeButton.addEventListener("click",this.changeSize.bind(this))

        return container;
    }
    handleEvent(e) {
        switch (e.type) {
            case "contextmenu":
                e.preventDefault()
                break
        }
    }

    setGame(game){
        this.game = game
    }
    getElement(){
        return this.element
    }

    show(type){
        this.element.style.display = "flex"
        if(type === "W"){
            this.loseMessage.style.display = "none"
            this.winMessage.style.display = "block"
        }
        else{
            this.loseMessage.style.display = "block"
            this.winMessage.style.display = "none"
        }
    }

    hide(){
        this.element.style.display = "none"
    }

    // handles new game of same size
    replay() {
        this.hide()
        this.game.rerender()
    }

    // handles displaying form where user can select size
    changeSize() {
        this.hide()
        const form = document.getElementById("sizeSelection");
        const gameElement = document.querySelector("#game")
        form.style.display = "block"
        gameElement.style.display = "none"

        document.querySelector("#game table").remove()
    }
}
