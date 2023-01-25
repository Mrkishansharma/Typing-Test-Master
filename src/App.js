import {useState, useEffect, useRef} from 'react'
import randomWords from 'random-words'
const NUMB_OF_WORDS = 50
const SECONDS = 60


function App() {
  const [words, setWords] = useState([])
  const [countDown, setCountDown] = useState(SECONDS)
  const [currInput, setCurrInput] = useState("")
  const [currWordIndex, setCurrWordIndex] = useState(0)
  const [currChar, setCurrChar] = useState("")
  const [currCharIndex, setCurrCharIndex] = useState(-1)
  const [correctWord, setCorrectWord] = useState(0)
  const [incorrectWord, setIncorrectWord] = useState(0)
  const [status, setStatus] = useState("Waiting....")
  const textInput = useRef(null)


  useEffect(()=>{
    setWords(generateWords())
  }, [])

  useEffect(()=> {
    textInput.current.focus()
  }, [status])

  function generateWords(){
    return new Array(NUMB_OF_WORDS).fill(null).map(()=> {
      return randomWords()
    })
  }

  function start(){
    if(status === "finished"){
      setWords(generateWords())
      setCurrWordIndex(0)
      setCorrectWord(0)
      setIncorrectWord(0)
      setCurrCharIndex(-1)
      setCurrChar("")
    }
    if(status !== "started"){
      setStatus("started")
      let interval = setInterval(()=>{
        setCountDown((prevCountDown)=> {
          if(prevCountDown===0){
            clearInterval(interval)
            setStatus("finished")
            setCurrInput("")
            return SECONDS
          }else{
            return prevCountDown - 1
          }
        })
      }, 1000)
    }
  }
 
  const paragraph = words.map((word,i)=>(
    <span  key={i}>
      <span>
        {word.split("").map((char,idx)=>(
          <span className={getCharClass(i,idx,char)} key={idx}>{char}</span>
        ))}
      </span>
      <span> </span>
    </span>
  ))

  function handleKeyDown({keyCode, key}){
    //Space bar code is 32 , backslace is 8
    if(keyCode === 32){
      checkMatch()
      setCurrInput("")
      setCurrWordIndex(currWordIndex + 1)
      setCurrCharIndex(-1)
    }else if(keyCode === 8){
      setCurrCharIndex(currCharIndex - 1)
      setCurrChar("")
    }
    else{
      setCurrCharIndex(currCharIndex + 1)
      setCurrChar(key)
    }
  }
  function checkMatch(){
    const wordToCompare = words[currWordIndex]
    const doesItMatch = wordToCompare === currInput.trim()
    doesItMatch ? setCorrectWord(correctWord + 1 ) : setIncorrectWord(incorrectWord + 1)
  }

  function getCharClass(wordIdx, charIdx, char){
    if(wordIdx === currWordIndex && charIdx===currCharIndex && currChar && status !=="finished"){
      if(char === currChar){
        return 'has-background-success success-color'
      }else{
        return 'has-background-danger danger-color'
      }
    }else if(wordIdx === currWordIndex && currCharIndex >= words[currWordIndex].length){
      return 'has-background-danger danger-color'
    }else{
      return ''
    }
  }

  return (
    <div className="App">

      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary count-down-box">
          <h2 className="for--count-down">{countDown}</h2>
        </div>
      </div>

      <div className="section1">
        <button className="button is-info button-start " onClick={start}> START</button>
      </div>

      <div className="control section ">
        <input 
          placeholder='Type here...'
          ref={textInput}
          disabled={status!=="started"}
          type="text input--box" 
          className="input input--box" 
          onKeyDown={handleKeyDown}
          value={currInput}
          onChange={(e) => setCurrInput(e.target.value)}
        />
      </div>

      {status==="finished" && (
        <>
          <div className="section">
            <div className="columns">
              <div className="column has-text-centered">
                <p className="is-size-5">Words Per Minutes :</p>
                <p className="has-text-primary is-size-1">{correctWord}</p>
              </div>
              <div className="column has-text-centered">
                <div className="is-size-5">Accuracy :</div>
                <p className="has-test-info is-size-1">{(correctWord + incorrectWord !==0) ? Math.round((correctWord / (correctWord + incorrectWord)) * 100) : 0} %</p>
              </div>
            </div>
          </div>
          <div className="result">
            <h1>TYPE TEST RESULT ................... Declared by ER. Kishan Sharma</h1>
          </div>
        </>
      )}

      {status!=="started" && (
        <div className='master--logo'>
          <h1>  T Y P E &nbsp; M A S T E R  </h1>
        </div>
      )}

      

      {status==="started" && (
        <div className="section para--box">
          <div className="card1">
            <div className="card-content1">
              <div className="content1 para">
                {paragraph}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
