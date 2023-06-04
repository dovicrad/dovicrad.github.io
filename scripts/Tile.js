export class Tile{
    constructor(x, y) {
        this.element = document.createElement('div')
        this.element.classList.add('tile','tileHidden')
        this.element.innerHTML = "0"
        this.element.dataset.x = x
        this.element.dataset.y = y
    }

    getX(){
        return Number.parseInt(this.element.dataset.x)
    }
    getY(){
        return Number.parseInt(this.element.dataset.y)
    }
    getValue(){
        return this.element.innerHTML;
    }
    getElement(){
        return this.element
    }
    addClass(className){
        this.element.classList.add(className)
    }
    removeClass(className){
        this.element.classList.remove(className)
    }
    hasClass(className){
        return this.element.classList.contains(className)
    }
    reveal(){
        if(!this.isFlag()){
            this.removeClass('tileHidden')
            this.addClass('tileVisible')
            if(this.getValue() === '0'){
                this.addClass('hiddenContent')
            }
        }
    }

    setBomb(){
        this.addClass('bomb')
        this.element.innerHTML = ""
    }

    isBomb(){
        return this.hasClass("bomb")
    }
    isFlag(){
        return this.hasClass("flag")
    }
    increaseBombCount(){
        if(this.isBomb() === false){
            this.element.innerHTML++
        }
    }
}