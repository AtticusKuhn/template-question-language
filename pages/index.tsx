import Head from 'next/head'
import Image from 'next/image'
import React, { ChangeEventHandler, TextareaHTMLAttributes, useRef, useState } from 'react'
import { LiveCodeEditor } from '../components/CodeEditor'
import { runParser } from '../lib/language/runParser'
import styles from '../styles/Home.module.css'

export default function Home() {
  // const textareaRef = useRef(null)
  // const outputaRef = useRef(null)
  // const [result, setResult] = useState("")

  // function handleCompile() {
  //   fetch("/api/hello", { method: "post", body: textareaRef.current.value }).then(e => e.text())
  //     .then(data => {
  //       setResult(data);
  //     })
  // }
  // const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
  //   // setResult(runParser(e.target.value))
  //   outputaRef.current.textContent = runParser(e.target.value)
  // }
  return (
    <>
      <LiveCodeEditor
        defaultCode={`{a=1+1} \n{increment a} \nsome text`}
      />
      {/* <CodeEditor
        code={`{a=1+1} \n {increment a} \n some text`}
        onChange
        editable
      />
      {/* <textarea style={{ width: "50vw", height: "50vh" }} onChange={handleChange} ref={textareaRef} placeholder="type something" /> */}
      {/* <button>Compile</button> */}
      {/* <pre ref={outputaRef} className="output"></pre> */}
    </>
  )
}
