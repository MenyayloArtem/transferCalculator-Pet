export interface IStage {
  payloadMass : number,
  dryMass : number,
  wetMass : number,
  Isp : number,
  thrust : number
}

export const G = 9.8

class Stage implements IStage  {

    public payloadMass : number;
    public dryMass : number;
    public wetMass : number;
    public Isp : number;
    public thrust : number
  
    constructor (stage : IStage) {
        this.dryMass = stage.dryMass
        this.payloadMass = stage.payloadMass
        this.wetMass = stage.wetMass
        this.Isp = stage.Isp
        this.thrust = stage.thrust
    }
  
    get dryTankMass () {
      return this.dryMass - this.payloadMass
    }
  
    get fuelMass () {
      return this.wetMass - this.dryMass
    }
  
    get fuelTankMass () {
      return this.dryTankMass + this.fuelMass
    }
  
    get fullMass () {
      return this.wetMass
    }
  
    get K () {
      return this.dryTankMass / (this.fuelTankMass)
    }
  
    get deltaV () {
      return this.Isp * G * Math.log(this.wetMass / this.dryMass)
    }
  }

export default Stage
