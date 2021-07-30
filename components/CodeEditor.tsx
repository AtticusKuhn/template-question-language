import { FormEvent, FormEventHandler, useEffect, useRef, useState } from "react"
import Editor from "react-simple-code-editor";
import { runParser } from "../lib/language/runParser";
// const Prism = require("./prism")
import Prism, { highlight } from "./prism.js"
Prism.languages.retmajgau = {
    myText: { pattern: /[^}\n](?![^{]*})/ },
    keyWords: { pattern: /if|then|else|for/ },
    boolean: { pattern: /true|false/ },
    // assignVariable:/[a-zA-Z]+=[^=]+/
    isEqual: { pattern: /==/ },

    myVariable: { pattern: /[a-zA-Z]+(?!=)=(?!=)/ }, ///[a-zA-Z]+(?!.*=)/,
    WS: { pattern: /[ \t]+/ },
    comment: { pattern: /\/\/.*?$/ },
    // number: /0|[1-9][0-9]*/,
    number: { pattern: /[0-9]+/ },
    string: { pattern: /"(?:\\["\\]|[^\n"\\])*"/ },
    plus: { pattern: /\+/ },
    lparen: { pattern: /\(/ },
    rparen: { pattern: /\)/ },
    lbrace: { pattern: /\{/ },
    rbrace: {
        pattern: /}/
    },
    identifier: { pattern: /[a-zA-Z][a-zA-Z_0-9]*/ },
    fatarrow: { pattern: /=>/ },
    assign: { pattern: /=/ },
}

interface LiveCodeEditorProps {
    defaultCode: string;
}

export const LiveCodeEditor: React.FC<LiveCodeEditorProps> = (props) => {
    const { defaultCode } = props
    const [code, setCode] = useState(defaultCode)
    const [output, setOutput] = useState(runParser(defaultCode))
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
                onValueChange={(rcode) => {
                    setCode(rcode)
                    onChange && onChange(rcode)

                }}
                highlight={(code) => highlight(code, Prism.languages.retmajgau)}
                padding={10}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    background: "#272822",

                    fontSize: 12,
                    color: "#f8f8f2",
                    // background: "none",
                    textShadow: "0 1px rgba(0, 0, 0, 0.3)",
                    // fontFamily: "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
                    // fontSize: "1em",s

                }}
            />

            <style>{`
            .myText { 
                color: white;
             }
            .keyWords { 
                color: blue
            }
            .boolean { 
                color: Chartreuse;
             }
            .isEqual { 
                color: orange
             }      
            .myVariable { 
                color: yellow;
             }
            .WS {
                color: grey;
             }
            .comment { 
                color: blue;
            }
            .number { 
                color: Chartreuse;
             }
            .string {  
                color: yellow;
            }
            .plus { 
                color: aqua;
            }
            .lparen { 
                color: red;
            }
            .rparen { 
                color: orange
            }
            .lbrace { 
                color: blueViolet;
             }
            .rbrace {
                color: blueViolet;
            }
            .identifier { 
                color: pink
             }
            .fatarrow { 
                color: red;
             }
            .assign: {
                color: purple
            }
            `}</style>
        </>
    )
}
export default CodeEditor