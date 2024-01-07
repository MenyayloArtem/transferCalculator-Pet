import Rocket from "./entity/Rocket"

export default class Helpers {



    public currentRocketIndex = 0

    public static ctx = {
        platform : (window as any).main.platform,
        saveRocket : (window as any).main.saveRocket,
        loadRockets : (window as any).main.loadRockets
    }

    public static writeResult (rocket : Rocket) {
        const optimal = rocket.findOptimal()
    
        return `
          Stage 1 delta: ${rocket.stage1.deltaV}\n
          Stage 2 delta: ${rocket.stage2.deltaV}\n
          Full delta: ${rocket.calc()}\n
          Optimal delta: ${optimal[0]}\n
          Optimal stage 1 mass: ${(rocket.stage1.payloadMass + (1 - optimal[1]) * rocket.rocketTanksMass) / (rocket.boosters || 1)}\n
          Optimal stage 2 mass: ${rocket.stage2.payloadMass + (optimal[1]) * rocket.rocketTanksMass}\n
          Profit: ${optimal[0] - rocket.calc()}
        `
      }

      public static async loadRockets() {
        let data = await this.ctx.loadRockets()
        return data
      }


}