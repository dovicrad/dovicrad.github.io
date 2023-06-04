export class Leaderboard {
    constructor() {
        this.size = 0
        this.times = []
        this.element = this.buildElement(this.size)
    }

    update(size){
        if(localStorage[size] === undefined){
            this.times = []
            localStorage[size] = this.times
        }
        else if (localStorage[size].length > 0 ){
            this.times = JSON.parse(localStorage[size])
        }
        this.size = size
        this.element = this.buildElement()
    }
    buildElement(){
        const table = document.createElement("table")
        if(this.times.length > 0) {
            const caption = document.createElement('caption')
            caption.innerText = "Leader Board - "+ this.size +"x"+this.size+":"

            const tableHeader = document.createElement("tr")
            tableHeader.innerHTML = "<th>Placement</th><th>Seconds</th><th>Milliseconds</th>"

            table.appendChild(caption)
            table.appendChild(tableHeader)

            for (let i = 0; i < this.times.length; i++) {
                const val = this.times[i]

                const row = document.createElement("tr")

                const placement = document.createElement("td")
                placement.innerText = String(i + 1)

                const sec = document.createElement("td")
                sec.innerText = String(Math.floor(val / 1000))

                const ms = document.createElement("td")
                ms.innerText = String(Math.floor(val % 1000))

                row.appendChild(placement)
                row.appendChild(sec)
                row.appendChild(ms)
                table.appendChild(row)
            }
        }
        return table
    }

    replaceElement(){
        let prevElement = this.element
        this.element = this.buildElement()

        prevElement.parentNode.replaceChild(this.element,prevElement)
    }

    addTime(time){
        this.times.push(time)
        this.times = this.filter(this.times)
        this.replaceElement()
        localStorage[this.size] =  JSON.stringify(this.times)
    }

    getElement(size) {
        console.log(size)
        if(this.size !== size){
            this.update(size)
        }
        return this.element;
    }

    filter(times) {
        const sortedArray = times.sort((a, b) => a - b);
        return sortedArray.slice(0, 10);
    }
}