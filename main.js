window.addEventListener('load', function(){
        const canvas = this.document.getElementById('canvas1')
        const ctx = canvas.getContext('2d')
        canvas.width = 2250
        canvas.height = 1500

        class Game{
            constructor(width, height){
                this.width = width
                this.height = height
            }
        }

        function animate(){
            ctx.clearRect(0,0,canvas.width, canvas.height)
            requestAnimationFrame(animate)
        }
        animate()
})