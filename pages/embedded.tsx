import { useRef } from "react"
import { runEmbedded } from "../lib/embeddedjs/runEmbedded"

const Embedded: React.FC<{}> = () => {
    const ref = useRef(null)
    return <>
        <textarea onChange={(e) => {
            console.log("textarea changed")
            const result = runEmbedded(e.target.value)
            console.log("result is", result)
            ref.current.innerText = result
        }} />
        <div ref={ref} />
    </>
}
export default Embedded