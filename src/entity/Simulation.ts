import Canvas from "./Canvas"
import Orbit from "./Orbit"

export default class Simulation {
    display : Canvas
    orbits : Orbit[]
    time : number = 0
    
    static maxDt = 100
    dT = Simulation.maxDt

    
  
    constructor (display : Canvas, orbits : Orbit[]) {
      this.display = display
      this.orbits = orbits
    }

    drawOrbit (orbit : Orbit, time? : number, color? : string) {
        const iter = 180
        orbit.t0 = time || (this.time > orbit.T ? this.time - (Math.floor(this.time /  orbit.T)) * orbit.T : this.time)
        let Orb = new Orbit({
          Ap : orbit.Ap,
          Pe : orbit.Pe,
          peArg : orbit.peArg,
          ascNodeLong : orbit.ascNodeLong
        }, orbit.t0)
    
        let rQ = Math.abs(JSON.parse(JSON.stringify(orbit.Q)))
    
        if (orbit.t0 >= orbit.T / 2) {
          rQ = 360 - Math.abs(rQ)
        }
    
        for (let i = 0; i < iter; i++) {
          Orb.t0 = orbit.T / iter * i
          let [x , y] = Orb.calcCoords()
          
          this.display.draw(x,y, color || `rgb(0,${255},0)`)
        }

        let [x,y] = orbit.calcCoords()
        let {periapsis, apoapsis} = orbit.calcPeriapsisAndApoapsisCoords()
        let {ascending, descending} = orbit.calcAscendingandDecendingNodeCoords()
  
          
        this.display.drawArc(x,y, 3, color)
        this.display.text("Pe", periapsis.x + 10, periapsis.y + 10)
        this.display.text("Восх. узел", ascending.x + 10, ascending.y + 10)

        this.display.text("Ap", apoapsis.x - 10, apoapsis.y - 10)
        this.display.text("Нисх. узел", descending.x - 10, descending.y - 10)
        
      }

      drawOrbits () {
        for (let orbit of this.orbits) {
          this.drawOrbit(orbit)
        }
      }
    
      out (orbit : Orbit) {
    
        let text = `
        Средняя аномалия: ${Math.floor(orbit.M)}
        Экцентрическая аномалия ${Math.floor(orbit.E)}
        Средняя аномалия из экцентрической: ${Math.floor(orbit.E2M(orbit.E))}
        Расстояние и истинная аномалия: ${Math.floor(orbit.R)} ${Math.floor(orbit.Q)}
        Экцентрическая аномалия: из истинной: ${Math.floor(orbit.Q2E(orbit.Q))}
        Средняя аномалия из экцентрической (проверка): ${Math.floor(orbit.E2M(orbit.Q2E(orbit.Q)))}
        Вычесленный и заданный период: ${Math.floor(orbit.M2T(orbit.E2M(orbit.Q2E(orbit.Q))))} ${Math.floor(orbit.t0)}
        `
    
        let dx = -this.display.canv.width / 2 + 10
        let dy = -80
        this.display.text(`Средняя аномалия: ${Math.floor(orbit.M)}`, dx, dy - 15)
        this.display.text(`Экцентрическая аномалия ${Math.floor(orbit.E)}`, dx, dy - 30)
        this.display.text(`Средняя аномалия из экцентрической: ${Math.floor(orbit.E2M(orbit.E))}`, dx, dy - 45)
        this.display.text(`Расстояние и истинная аномалия: ${Math.floor(orbit.R)} ${Math.floor(orbit.Q)}`, dx, dy - 60)
        this.display.text(`Экцентрическая аномалия: из истинной: ${Math.floor(orbit.Q2E(orbit.Q))}`, dx, dy - 75)
        this.display.text(`Средняя аномалия из экцентрической (проверка): ${Math.floor(orbit.E2M(orbit.Q2E(orbit.Q)))}`, dx, dy - 90)
        this.display.text(`Вычесленный и заданный период: ${Math.floor(orbit.M2T(orbit.E2M(orbit.Q2E(orbit.Q))))} ${Math.floor(orbit.t0)}`, dx, dy - 105)
        return text
      }
  
    run(cbk : (i? : number) => void) {
        let cb = () => {
          this.display.clear()
          
    
          
          this.display.drawArc(0,0,5)
          
          this.drawOrbits()
          // this.out()
          
          this.time += this.dT
          cbk(this.time)
          // break
          }

          let interval = setInterval(cb,1000 / 60)
          return interval
        }

        
  }