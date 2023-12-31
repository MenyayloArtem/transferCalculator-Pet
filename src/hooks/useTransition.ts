import { useEffect, useRef, useState } from "react";
import usePrev from "./usePrev";

export default function (state : number) {
    
    const prevState = usePrev(state)
    const [transitionState, setTransitionState] = useState<number>(prevState)

    function inRange (num1 : number,num2 : number, range = 1) {
        return Math.abs(num1 - num2) <= range
    }

    useEffect(() => {
        setTransitionState(prevState)
    }, [prevState])

    useEffect(() => {
        let diff = state - prevState

        let interval = setInterval(() => {
            if (Math.abs(state - transitionState) > 0.1) {
                setTransitionState(st => st + diff / (10 * 1000 / 60))
            }
        }, 1000 / 60)

        return () => clearInterval(interval)
    },[transitionState, prevState, state])

    return transitionState
}