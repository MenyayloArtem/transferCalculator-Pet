export interface Point {
    x : number,
    y : number
  }
  
  export default class Canvas {
      canv : any
      ctx : any
      id : string
      zoom : number
      offset : {
        x : number,
        y : number
      }
      zoomPoint : {
        x : number,
        y : number
      }
    
        constructor (id : string, offsetX = 0, offsetY = 0, zoom = 1) {
          this.id = id
    
          this.offset = {
            x : 0,
            y : 0
          }
  
          this.zoomPoint = {
            x : 0,
            y : 0
          }
    
            this.canv = document.getElementById(this.id)
            this.ctx = this.canv.getContext("2d")
            this.zoom = zoom
            this.offset.x = offsetX
            this.offset.y = offsetY
        }
  
        private centerPoint(p : Point) {
          let n = JSON.parse(JSON.stringify(p))
          n.x = n.x + this.canv.width / 2 + this.offset.x
          n.y = this.canv.height - (n.y + this.canv.height / 2) + this.offset.y
          return n
        }
    
        draw (x : number,y : number, color = "lime", pixel = 1) {
            this.ctx.fillStyle = color
            this.ctx.fillRect(x / (1 / this.zoom) + this.offset.x + this.canv.width / 2 - pixel / 2,(this.canv.height - pixel - y / (1 / this.zoom)) - this.offset.y - this.canv.height / 2 + pixel / 2,pixel,pixel)
        }
  
        drawArc (x : number,y : number, r : number,color = "lime") {
          // let {x, y} = this.centerPoint({x : nx,y : ny})
          
          this.ctx.beginPath()
          this.ctx.fillStyle = color
          this.ctx.arc(x / (1 / this.zoom) + this.offset.x + this.canv.width / 2,(this.canv.height - y / (1 / this.zoom)) - this.offset.y - this.canv.height / 2,r,0, Math.PI * 2)
          this.ctx.fill()
        }
    
        clear() {
          this.ctx.clearRect(0,0,this.canv.width, this.canv.height)
        }
  
        text (text : string, nx : number, ny: number, size = 20) {
          this.ctx.fillStyle = "white"
          this.ctx.font = `Arial ${size}px`
          let [x,y] = 
            [nx / (1 / this.zoom) + this.offset.x + this.canv.width / 2,
            (this.canv.height - ny / (1 / this.zoom)) - this.offset.y - this.canv.height / 2]
         
  
          this.ctx.fillText(text,x,y)
          this.ctx.fill()
        }
    
    
        frame (cb : Function) {
          this.ctx.clearRect(0,0,this.canv.width, this.canv.height)
          cb()
        }
    
        onClick(cb : Function) {
          this.canv.addEventListener("click", cb)
        }
    
        addOffset(x = 0,y = 0) {
          this.offset.x += x
          this.offset.y += y
        }
    
        setOffset(x = 0,y = 0) {
          this.offset.x = x
          this.offset.y = y
        }
        
        setZoom(zoom : number) {
          this.zoom = zoom
        }
  
        changeZoomPoint(x : number,y : number) {
          this.zoomPoint.x += x / this.zoom
          this.zoomPoint.y += y / this.zoom
  
          this.setOffset(-this.zoomPoint.x * this.zoom * 2, -this.zoomPoint.y * this.zoom * 2) 
        }
  
        line (start : Point, end : Point, color = "lime") {
          start = this.centerPoint(start)
          end = this.centerPoint(end)
          this.ctx.strokeStyle = color
          this.ctx.beginPath()
          this.ctx.moveTo(start.x, start.y)
          this.ctx.lineTo(end.x,end.y)
          this.ctx.stroke()
        }
    }