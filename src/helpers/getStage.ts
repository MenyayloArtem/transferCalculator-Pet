export default function getStage(className : string) {
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