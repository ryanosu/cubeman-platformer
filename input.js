// array methodology for moving cubeman around

export class InputHandler{
    constructor(){
        this.keys = [];

        // add pressed key to array
        window.addEventListener('keydown', e=>{
            
            if ((e.key === 'ArrowDown' || 
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'p' || // debug for bruised
                e.key === 'Control') && 
                this.keys.indexOf(e.key) === -1){ // if key not already in array
                    this.keys.push(e.key)
            }
            console.log("keydown", e.key, this.keys)
        })

        // if key in array, remove it
        window.addEventListener('keyup',e=>{
            if (e.key === 'ArrowDown' || 
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === 'p' || // debug for bruised
                e.key === 'Control'){
                    this.keys.splice(this.keys.indexOf(e.key),1) // 2 args: index, how many elements to remove at that index
            }
            console.log("keyup", e.key, this.keys)
        })
    }
}