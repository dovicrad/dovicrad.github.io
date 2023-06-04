export class Timer {
    constructor() {
        this.element = document.getElementById("time")
        this.start_time = 0
        this.end_time = 0
    }

    start(){
        this.start_time = performance.now()
        this.updateElement()
        this.interval = setInterval(this.updateElement.bind(this),1000)
    }

    end(){
        this.end_time = performance.now()
        clearInterval(this.interval)
    }

    getTime(){
        return this.end_time - this.start_time
    }

    updateElement() {
        this.element.innerText = String(Math.floor((performance.now()  - this.start_time)/1000))
    }
}