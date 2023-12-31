// import Helpers from "./Helpers"
// import Rocket from "./Rocket"
// import RocketForm from "./entity/RocketForm"

// export default class App extends Helpers {

//     public rockets: Rocket[] = []
//     public currentRocket: Rocket|null = null

//     public userInterface = new RocketForm()
//     public elements = this.userInterface.elements
//     public isNew = false

//     constructor () {
//         super()
//         this.loadRockets()
//         .then((data) => {
//             Rocket.loadedRockets = data
//             this.rockets = Rocket.loadedRockets
//             this.currentRocket = this.rockets[0]
//             this.userInterface.setValues(this.currentRocket)
//             this.calculateResult()
//         })

//         this.applyEventListeners()
//     }

//     public async loadRockets() {
//         let data = await Helpers.ctx.loadRockets()
//         return data
//     }

//     public calculateResult () {
//         this.currentRocket = this.userInterface.getValues()
//         this.userInterface.setValues(this.currentRocket)
//         // app.writeResult(this.currentRocket!, this. elements.result)
//     }

//     public onPaginate (i : number) {
//         this.currentRocket = this.rockets[i]
//         this.userInterface.setValues(this.currentRocket)
//         this.elements.prevButton.innerText = String(4)
//         this.calculateResult()
//     }

//     public applyEventListeners () {
//         this.elements.calculateButton.addEventListener("click",() => this.calculateResult())
//         this.elements.newButton.addEventListener("click", () => {this.userInterface.clearValues(); this.isNew = true})

//         this.elements.saveButton.addEventListener("click", () => {
//             let savedRocket = this.userInterface.getValues()
//             Helpers.ctx.saveRocket(savedRocket)
//             this.currentRocket = savedRocket
//             if (this.isNew) {
//                 this.rockets.push(this.currentRocket)
//             }
//         })

//         this.elements.prevButton.addEventListener("click", () => {
//             if (this.currentRocketIndex - 1 >= 0) {
//                 this.currentRocketIndex--
//                 this.currentRocket = this.rockets[this.currentRocketIndex]
//                 this.userInterface.setValues(this.currentRocket)
//                 this.calculateResult()
//             }
            
//         })
//         this.elements.nextButton.addEventListener("click", () => {
//             if (this.currentRocketIndex + 1 < this.rockets.length) {
//                 this.currentRocketIndex++
//                 this.currentRocket = this.rockets[this.currentRocketIndex]
//                 this.userInterface.setValues(this.currentRocket)
//                 this.calculateResult()
//             }
            
//         })
//     }

    
// }