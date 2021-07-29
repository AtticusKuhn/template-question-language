import { useEffect } from "react"

// const Prism = require("./prism")
import Prism from "./prism.js"
interface CodeEditorProps {
    editable?: boolean
    code: string;
}
const CodeEditor: React.FC<CodeEditorProps> = (props) => {
    const { editable, code } = props
    useEffect(() => {
        Prism.highlightAll()
        // console.log("useEffect");
        // // test.current.innerText=props.children
        // return () => {
        //   console.log("unmount");
        // };
    }, [props])
    return (
        <>
            <pre >
                <code id="help-me" className="language-python">
                    {code}
                </code>
            </pre>
        </>
    )
}
export default CodeEditor