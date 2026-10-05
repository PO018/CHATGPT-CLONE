import { useState } from "react"
import axios from "axios"
import "./App.css"

function App() {

  const [prompt, setprompt] = useState("")
  const [result, setresult] = useState("")
  const [listening, setListening] = useState(false)

  function handleChange(event){
    setprompt(event.target.value)
  }

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.")
      return
    }

    const recognition = new SpeechRecognition()

    recognition.lang = "en-IN"

    recognition.onstart = () => {
      setListening(true)
    }

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript
      setprompt(spokenText)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.start()
  }

  async function handleclick(){

    const response = await axios.post(
      "http://127.0.0.1:8000/send-prompt",
      {
        text: prompt
      }
    )

    setresult(response.data.response)
  }

  return(
    <div className="container">

      <h1>Gemini API Project</h1>

      <div className="input-box">

        <textarea
          placeholder="Enter the prompt"
          value={prompt}
          onChange={handleChange}
        />

        <button
          className={`mic-button ${listening ? "listening" : ""}`}
          onClick={startListening}
        >
          🎤
        </button>

      </div>

      <button onClick={() => {handleclick()}}>
        Get Response
      </button>

      <p>Result</p>

      <p>{result}</p>

    </div>
  )
}

export default App