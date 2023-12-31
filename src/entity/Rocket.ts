import Stage, { G, IStage } from "./StageClass";
import getStage from "../helpers/getStage";

export interface IRocket {
  stage1: IStage,
  stage2: IStage,
  title : string,
  boosters : number
}

export default class Rocket implements IRocket {

    public stage1 : Stage;
    public stage2 : Stage;
    public title : string
    public boosters: number;
  
    constructor (stage1 : IStage, stage2 : IStage, title : string, boosters = 0) {
      this.stage1 = new Stage(stage1)
      this.stage2 = new Stage(stage2)
      this.title = title
      this.boosters = boosters
    }
  
    get rocketTanksMass () {
      return this.stage1.fuelTankMass + this.stage2.fuelTankMass
    }
  
    get fullMass () {
      return this.stage1.wetMass + this.stage2.wetMass
    }

    static loadedRockets : Rocket[] = []

    static setLoadedRockets (rockets : any[]) {
        this.loadedRockets = rockets
    }

    // static create (title : string) {
    //     let stage1 = new Stage(getStage("st-1"))
    //     let stage2 = new Stage(getStage("st-2"))
    //     return new Rocket(stage1, stage2, title)
    // }

    get avarangeIsp () {
      return (this.stage1.Isp * this.boosters + this.stage2.Isp) / (this.boosters + 1)
    }

    static getRocket (i : number) : Rocket {
        return this.loadedRockets[i]
    }
  
    public findOptimal () {
      let max = [0,0]
  
      for (let i = 0.05; i < 0.95; i += 0.05) {
        const dV = this.calc(i)
  
        if (dV > max[0]) {
          max[0] = dV
          max[1] = i
        }
      }
  
      return max
    }
  
    calc (X? : number) {
      if (!X) {
        X = this.stage2.fuelTankMass / this.rocketTanksMass
      }
  
      if (this.boosters != 0) { 
        let dm2 = this.stage2.thrust / (this.stage2.Isp * G)
        let dm1 = this.stage1.thrust / (this.stage1.Isp * G)
  
        let stage1 = new Stage({
          Isp : this.stage1.Isp,
          payloadMass : this.stage1.payloadMass,
          thrust : this.stage1.thrust,
          wetMass : (1 - X) * this.rocketTanksMass + this.stage1.payloadMass,
          dryMass : this.stage1.K * (1-X) * this.rocketTanksMass + this.stage1.payloadMass,
        })
  
        let stage2 = new Stage({
          Isp : this.stage2.Isp,
          payloadMass : this.stage2.payloadMass,
          thrust : this.stage2.thrust,
          wetMass : (X) * this.rocketTanksMass + this.stage2.payloadMass,
          dryMass : this.stage2.K * (X) * this.rocketTanksMass + this.stage2.payloadMass,
        })
  
        let t1 = stage1.fuelMass / this.boosters / dm1
  
        let fc2 = dm2 * t1
        let fc1 = dm1 * t1
        let fcTotal = fc1 * this.boosters + fc2
  
        let md1 = this.fullMass - fcTotal
  
        let mv2 = stage2.wetMass - fc2
  
        let dV1 = this.avarangeIsp * G * Math.log(this.fullMass / md1)
        let dV2 = stage2.Isp * G * Math.log(mv2 / stage2.dryMass)

        return dV1 + dV2
      } else {
        let mf1 = this.stage1.payloadMass + (1 - X) * this.rocketTanksMass
        let md1 = this.stage1.payloadMass + this.stage1.K * (1 - X) * this.rocketTanksMass
  
        let mf2 = this.stage2.payloadMass + X * this.rocketTanksMass
        let md2 = this.stage2.payloadMass + this.stage2.K * X * this.rocketTanksMass
  
        return this.stage1.Isp * G * Math.log((mf1 + mf2) / (md1 + mf2)) + this.stage2.Isp * G * Math.log(mf2 / md2)
      }
    }
  }