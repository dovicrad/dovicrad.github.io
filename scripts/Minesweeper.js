import {Tile} from "./Tile.js";

export class Minesweeper {
    constructor(modal,timer,leaderboard,size = 16,bombs = 30 ) {
        this.size = size
        this.numberOfBombs = bombs
        this.numberOfPlacedFlags = 0
        this.bombTiles = new Set()

        this.modal = modal
        this.modal.setGame(this)

        this.timer = timer

        this.element = document.createElement("div")
        this.leaderboard = leaderboard
    }

    //creates arrays of Tiles of required size
    createTileMatrix(size_x,size_y){
        const matrix = []
        for (let y = 0; y < size_y;y++){
            matrix.push([])
            for (let x = 0; x < size_x;x++){
                const tile = new Tile(y,x)
                matrix[y].push(tile)
            }
        }
        return matrix
    }
    
    // Updates css property based on size -> html can scale properly
    changeCssSize(size){
        const root = document.querySelector(':root');
        root.style.setProperty('--size', String(size));
    }

    buildElement(){
        const element = document.createElement('div')
        element.classList.add('gameBoard')

        element.addEventListener("mouseup", this)
        element.addEventListener("contextmenu", this)

        for (let y = 0; y < this.tiles.length; y++){
            const rowEl = document.createElement('div')
            rowEl.classList.add('gameRow')

            for (let x = 0; x < this.tiles[0].length;x++){
                rowEl.appendChild(this.tiles[y][x].getElement())
            }

            element.appendChild(rowEl)
        }

        return element
    }

    
    // prepares for start of a new game
    setup(bombs = this.numberOfBombs, size = this.size){
        this.numberOfBombs = bombs;
        this.size = size

        this.changeCssSize(this.size)

        this.numberOfPlacedFlags = 0
        this.bombTiles = new Set()

        this.tiles = this.createTileMatrix(size, size)
        this.insertBombs(this.numberOfBombs)

        this.element = this.buildElement()

        this.timer.start()
    }

    handleEvent(e){
        switch (e.type){
            case "mouseup":
                this.mouseEvent(e)
                break
            case "contextmenu":
                e.preventDefault()
                break
        }
    }

    mouseEvent(e){
        switch (e.which){
            case 1:
                if(e.target.classList.contains("bomb")){
                    this.endGame("L")
                    this.revealBombs()
                    e.target.style.backgroundColor = "red"
                }
                this.revealZeroValueIslandRecursive(Number.parseInt(e.target.dataset.x),Number.parseInt(e.target.dataset.y))
                break
            case 3:
                this.tileFlagToggle(Number.parseInt(e.target.dataset.x),Number.parseInt(e.target.dataset.y))
                if(this.checkForWin()){
                    this.endGame("W")
                    this.leaderboard.addTime(this.timer.getTime())
                }
                break
        }
    }

    // reveals island of tiles that dont have bombs nearby and their edges starting from tile at x,y
    revealZeroValueIslandRecursive(x, y){
        const myTile = this.tiles[x][y]
        if(myTile.getElement().classList.contains("tileHidden")){
            myTile.reveal()
            if(myTile.getValue() === "0"){
                this.getNeighbours(x,y).forEach(neighbour => this.revealZeroValueIslandRecursive(neighbour.getX(),neighbour.getY()))
            }
        }
    }

    // returns neigboring tiles icluding corners -> max 8 neighbours returned
    getNeighbours(targetX,targetY){
        let neighbours = []
        for(let x = Math.max(0,targetX-1); x<=Math.min(targetX+1,this.tiles[0].length-1); x++){
            for(let y = Math.max(0,targetY-1); y<=Math.min(targetY+1,this.tiles[0].length-1); y++){
                if(!(x === targetX && y === targetY)){
                    neighbours.push(this.tiles[x][y])
                }
            }
        }
        return neighbours
    }

    insertBombs(count = 5){
        if (this.tiles.length === 0 || this.bombTiles.size + count > this.tiles.length * this.tiles[0].length) {
            console.log("there is not enough empty spaces for ", count, " bombs")
        }
        else {
            let bombX = 0
            let bombY = 0
            for (let i = 0; i < count; i++) {
                do {
                    bombX = Math.floor(Math.random() * this.tiles.length)
                    bombY = Math.floor(Math.random() * this.tiles[0].length)
                } while (this.tiles[bombX][bombY].isBomb())

                let bombTile = this.tiles[bombX][bombY]
                bombTile.setBomb()
                this.bombTiles.add(bombTile)

                this.getNeighbours(bombX, bombY).forEach(neighbour => neighbour.increaseBombCount())
            }
        }
    }
    
    // remove old game and display new one
    rerender(){
        let prevElement = this.element
        this.setup()
        prevElement.parentNode.replaceChild(this.element,prevElement)
    }

    getElement(){
        return this.element
    }

    tileFlagToggle(targetX, targetY) {
        let myTile = this.tiles[targetX][targetY].getElement()
        if(myTile.classList.contains("tileHidden")){
            if(myTile.classList.contains("flag")){
                myTile.classList.remove("flag")
                this.numberOfPlacedFlags--
            }
            else{
                myTile.classList.add("flag")
                this.numberOfPlacedFlags++
            }
        }
    }

    checkForWin() {
        if(this.bombTiles.size !== this.numberOfPlacedFlags){
            return false
        }
        for(const bombElement of this.bombTiles){
            if(!bombElement.getElement().classList.contains("flag")){
                return false
            }
        }
        return true
    }

    endGame(type) {
        this.modal.show(type)
        this.timer.end()
    }
    
    // reveals all bombs, used only at end of failed game
    revealBombs() {
        for(const bombElement of this.bombTiles){
            this.tiles[bombElement.getX()][bombElement.getY()].reveal()
        }
    }
}
