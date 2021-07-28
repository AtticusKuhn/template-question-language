import Head from 'next/head'
import Image from 'next/image'
import { TextareaHTMLAttributes, useRef, useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const textareaRef = useRef(null)
  const outputaRef = useRef(null)
  const [result, setResult] = useState("")

  function handleCompile() {
    fetch("/api/hello", { method: "post", body: textareaRef.current.value }).then(e => e.text())
      .then(data => {
        setResult(data);
      })
  }
  return (
    <>
      <textarea ref={textareaRef} placeholder="type something" />
      <button onClick={handleCompile}>Compile</button>
      <div ref={outputaRef} className="output">output : {result}</div>
    </>
  )
}
