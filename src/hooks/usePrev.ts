import { useEffect, useRef, useState } from "react";

export default function (value: number): number {
    const [prevState, setPrevState] = useState<number>(value)
    const [currentState, setCurrentState] = useState<number>(value)

    useEffect(() => {
        setCurrentState((prev) => {
            setPrevState(prev)
            return value
        })
    }, [value])
    
    return prevState;
  }