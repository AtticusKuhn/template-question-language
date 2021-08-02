import { FormEvent, FormEventHandler, useEffect, useMemo, useRef, useState } from "react"
import Editor from "react-simple-code-editor";
import { runParser } from "../lib/language/runParser";
import { bruhRules, prismStyles } from "../lib/language/lexer"
// const Prism = require("./prism")
import Prism, { highlight } from "./prism.js"

Prism.languages.retmajgau = bruhRules

interface LiveCodeEditorProps {
    defaultCode: string;
}

export const LiveCodeEditor: React.FC<LiveCodeEditorProps> = (props) => {
    const { defaultCode } = props
    const [code, setCode] = useState(defaultCode)
    const defaultOutput = useMemo(() => runParser(code), [defaultCode])
    const [output, setOutput] = useState(defaultOutput)
    const outputRef = useRef(null)
    function onChange(newCode: string) {
        setCode(newCode)
        setOutput(runParser(newCode))
        // outputRef.current.innerText = runParser(newCode);
    }
    return <>
        <CodeEditor
            code={code}
            editable
            onChange={onChange}
        />
        <div ref={outputRef} className="output">{output}</div>
    </>
}

interface CodeEditorProps {
    editable?: boolean
    code: string;
    onChange?: (value: string) => any;
}
const CodeEditor: React.FC<CodeEditorProps> = (props) => {
    const { editable, code, onChange } = props
    const [rcode, setCode] = useState(code);
    return (
        <>
            <Editor
                // onChange={(e) => console.log("onchange", ) onChange && onChange(e, rcode)}
                value={rcode}
                onValueChange={(newCode) => {
                    setCode(newCode)
                    onChange && onChange(newCode)

                }}
                highlight={(code) => highlight(code, Prism.languages.retmajgau)}
                padding={10}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    background: "#272822",

                    fontSize: 20,
                    color: "#f8f8f2",
                    caretColor: "green",

                    // background: "none",
                    textShadow: "0 1px rgba(0, 0, 0, 0.3)",
                    // fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
                    // fontSize: "1em",s

                }}
            />
            <style>{prismStyles}</style>
        </>
    )
}
export default CodeEditor