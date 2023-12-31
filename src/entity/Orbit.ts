import Canvas from "./Canvas"

interface IOrbit {
    Ap : number,
    Pe : number,
    peArg : number,
    ascNodeLong : number
  }
  

  
 export default class Orbit implements IOrbit {
    Ap : number
    Pe : number
    ascNodeLong: number
    // T : number
    t0 : number
    peArg: number

    static bodyR = 6670000

    static Mu = 3.986 * Math.pow(10,14)
  
    constructor (orbit : IOrbit, t0 : number) {
      
      this.Ap= orbit.Ap
      this.Pe = orbit.Pe
      this.ascNodeLong = orbit.ascNodeLong
      this.peArg = orbit.peArg
      this.t0 = t0
    }

    get a () {
      return (this.Ap + Orbit.bodyR * 2 + this.Pe) / 2
    }

    get e () {
      const rA = Orbit.bodyR + this.Ap
      const rP = Orbit.bodyR + this.Pe
      return (rA - rP) / (rA + rP)
    }

    static calcT (Ap : number, Pe : number) {
      let a = (Ap + Orbit.bodyR * 2 + Pe) / 2
      return 2 * Math.PI * Math.sqrt((Math.pow(a,3) / Orbit.Mu))
    }

    get T () {
      return Orbit.calcT(this.Ap, this.Pe)
    }
  
    get M () {
      return (2 * Math.PI) / this.T * this.t0
    }
  
    E2M (E : number) {
      return E - this.e * Math.sin(E)
    }
  
    M2E (M : number) {
      let s = Math.PI
      let e = s
      let M1 = M
    
      for (let i = 0; i < 40; i++) {
        let M2 = this.E2M(e)
    
        if (M1 == M2) {
          return s
        }
    
        s = s / 2
    
        if ((M1 - M2) < 0) {
          e -= s
        } else if ((M1 - M2) > 0) {
          e += s
        }
      }

      return e
    }

    Q2R (Q : number) {
      return this.a * (1 - this.e * Math.cos(this.Q2E(Q)))
    }

    E2Q (E : number) {
      return Math.atan(Math.sqrt((1 + this.e) / (1 - this.e)) * Math.tan((E / 2))) * 2
    }

    M2Q (M : number) {
      const E = this.M2E(M)
      const Q = this.E2Q(E)
      return Q
    }

    Q2T (Q : number) {
      const E = this.Q2E(Q)
      const M = this.E2M(E)
      let T = this.M2T(M)

      if (T < 0) {
        T = this.T + T
      }

      return T
    }

    timeToQ (Q : number) {
      let time = this.Q2T(Q) - this.t0

      if (time < 0) {
        time += this.T
      }

      return time
    }



    get E () {
      return this.M2E(this.M)
    }
  
    get R () {
      return this.Q2R(this.Q)
    }
  
    get Q () {
      let q = this.E2Q(this.E)

      return q > 0 ? q : q + 2 * Math.PI
      return q
    }
  
    static toRad (n : number) {
      return n / 180 * Math.PI
    }

    static toAng (n : number) {
      return n / Math.PI * 180
    }

    static QtoAng (Q : number) {
      if (Q < 0) {
        Q += Math.PI
      }

      return Q
    }

    static ang (orbit : Orbit) {
      let Q = (Orbit.QtoAng(orbit.Q))

      let ang = Orbit.cutPI(Q + Orbit.toRad(orbit.peArg + orbit.ascNodeLong))
      return ang
    }

    static angleBetween (orbit1 : Orbit, orbit2 : Orbit) {
      let q1 = Orbit.ang(orbit1)
      let q2 = Orbit.ang(orbit2)

      let ang1 = Orbit.cutPI(q1)
      let ang2 = Orbit.cutPI(q2)

      let res = Math.abs(ang1 - ang2)

      if (q2 > q1) {
        res = 2 * Math.PI - res
      }

      return Orbit.cutPI(res)
    }

    static cutPI (angle : number) {
      return angle - (Math.floor(angle /( Math.PI * 2)) * Math.PI * 2)
    }
  
    Q2E (Q: number) {
      return Math.atan(Math.tan((Q) / 2) / Math.sqrt((1 + this.e) / (1 - this.e))) * 2
    }
  
    M2T(M : number) {
      return M / (2 * Math.PI / this.T)
    }

    calcCoordsAt (Q : number, cR? : number) {
      let R = cR || this.R
      let x = R * Math.cos(Q + Orbit.toRad(this.peArg + this.ascNodeLong))
      let y = R * Math.sin(Q + Orbit.toRad(this.peArg + this.ascNodeLong))

      return [x,y]
    }
  
    calcCoords () {
      let coords = this.calcCoordsAt(this.Q)
      let x = coords[0]
      let y = coords[1]
      return [x,y]
    }

    calcPeriapsisAndApoapsisCoords () {
      let periapsisR = this.Q2R(0)
      let apoapsisR = this.Q2R(Math.PI)

      let px = periapsisR * Math.cos(Orbit.toRad(this.peArg + this.ascNodeLong))
      let py = periapsisR * Math.sin(Orbit.toRad(this.peArg + this.ascNodeLong))

      let ax = apoapsisR * Math.cos(Orbit.toRad(this.peArg + this.ascNodeLong + 180))
      let ay = apoapsisR * Math.sin(Orbit.toRad(this.peArg + this.ascNodeLong + 180))

      let periapsis = {
        x : px,
        y : py
      }

      let apoapsis = {
        x : ax,
        y : ay
      }

      return {apoapsis,periapsis}
    }

    calcAscendingandDecendingNodeCoords () {
      let ascR = this.Q2R(Orbit.toRad(this.ascNodeLong))
      let descR = this.Q2R(Orbit.toRad(this.ascNodeLong + 180))

      let ascX = ascR * Math.cos(Orbit.toRad(this.ascNodeLong))
      let ascY = ascR * Math.sin(Orbit.toRad(this.ascNodeLong))

      let descX = descR * Math.cos(Orbit.toRad(this.ascNodeLong + 180))
      let descY = descR * Math.sin(Orbit.toRad(this.ascNodeLong + 180))

      let ascending = {
        x : ascX,
        y : ascY
      }

      let descending = {
        x : descX,
        y : descY
      }
      return {ascending,descending}
    }
  
    
  }