import { useCallback, useEffect, useState } from "react"

export default function (list : any[], onChange : (i : number) => void) : any[] {
    const [index, setIndex] = useState<number>(0)
    const decrement = useCallback(() => {
        if (index - 1 >= 0) {
            setIndex(i => i - 1)
        }
    }, [index, list])

    const increment = useCallback(() => {
        if (index + 1 < list.length) {
            setIndex(i => i + 1)
        }
    }, [index, list])

    useEffect(() => {
        if (list.length) {
            onChange(index)
        }
    }, [index, list])

    return [increment, decrement, index, setIndex]
}