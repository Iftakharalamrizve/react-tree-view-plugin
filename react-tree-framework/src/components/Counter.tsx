import React,{useState} from 'react'

interface Props {}

export function Counter(props: Props) {
    const {} = props
    const [counter,setCounter] = useState(0)

    function increment(){
        setCounter(counter + 1)
    }
    function decrement(){
        setCounter(counter - 1)
    }

    return (
        <>
            <button onClick={increment}> + </button>
                {counter}
            <button onClick={decrement}> - </button>
        </>
    )
}
