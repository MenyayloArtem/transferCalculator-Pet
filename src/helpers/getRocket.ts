import Stage from "../Stage"
import Rocket from "../Rocket"
import getStage from "./getStage"
import { titleInput } from "../renderer"

export default function getRocket() : Rocket {
    const stage1 = new Stage(getStage("st-1") as any)
    const stage2 = new Stage(getStage("st-2") as any)
    const rocket = new Rocket(stage1, stage2, titleInput.value)
    return rocket
  }