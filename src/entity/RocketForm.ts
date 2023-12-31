import Helpers from "../Helpers"
import Rocket from "./Rocket"
import Stage from "./StageClass"

export default class RocketForm extends Helpers {

  public elements = {
    result : document.querySelector(".result") as HTMLElement,
    title : document.getElementsByName("title")[0] as HTMLInputElement,
    calculateButton : document.getElementById("calc") as HTMLElement,
    saveButton : document.getElementById("save") as HTMLElement,
    prevButton : document.getElementById("prev") as HTMLElement,
    nextButton : document.getElementById("next") as HTMLElement,
    newButton : document.getElementById("new") as HTMLElement
  }

    getStageBlock(className : string) {
        const stageBlock = document.querySelector(`.${className}`)
        const inputs = stageBlock?.querySelectorAll("input")
      
        let arr : number[] = []
      
        for (let input of inputs!) {
          arr.push(+input!.value)
        }
      
        return {
          wetMass : arr[0],
          dryMass : arr[1],
          payloadMass : arr[2],
          Isp : arr[3]
        }
      }

    public getValues() : Rocket {
        const stage1 = new Stage(this.getStageBlock("st-1") as any)
        const stage2 = new Stage(this.getStageBlock("st-2") as any)
        const rocket = new Rocket(stage1, stage2, this.elements.title.value)
        return rocket
    }

    public setValues (rocket : any) {
        
        function setStageInput (stage : number) {
            let st1 = document.querySelector(`.st-${stage}`)
            let inputs = st1!.querySelectorAll('input')
            
            for (let input of inputs) {
                input.value = rocket[`stage${stage}`][input.name]
            }
        }
        
        this.elements.title.value = rocket.title
        setStageInput(1)
        setStageInput(2)
    }

    public clearValues () {
      let inputs : HTMLInputElement[]= document.querySelectorAll(".app__content input") as any
      this.elements.title.value = ""
      for (let input of inputs) {
        input.value = ""
      }
    }
}