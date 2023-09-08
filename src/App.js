import React, { useState, useEffect } from 'react'

const HIRAGANA = {
  'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
  'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
  'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
  'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
  'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
  'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
  'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
  'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
  'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
  'わ': 'wa', 'を': 'wo',
  'ん': 'n',
}

const HIRAGANA_LEN = Object.keys(HIRAGANA).length

const HiraganaGame = () => {
  const [currentHiragana, setCurrentHiragana] = useState('')
  const [lastHiragana, setLastHiragana] = useState('')
  const [userInput, setUserInput] = useState('')
  const [correctCount, setCorrectCount] = useState(0)
  const [wrongCount, setWrongCount] = useState(0)
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
  const [hiraganaErrors, setHiraganaErrors] = useState({})

  useEffect(() => {
    // Load errors from localStorage on component mount
    const storedErrors = JSON.parse(localStorage.getItem('hiraganaErrors')) || {}
    updateHiraganaErrors(storedErrors)

    // Randomly select a Hiragana character
    const randomHiragana = getRandomHiragana(storedErrors)
    setCurrentHiragana(randomHiragana)
  }, [])

  const getRandomHiragana = (errors) => {
    const errorKeys = Object.keys(errors)
    const hiraganaCharacters = errorKeys.length > 0 && Math.floor(Math.random() * 100) < 10 * errorKeys.length ? errorKeys : Object.keys(HIRAGANA)
    const randomIndex = Math.floor(Math.random() * hiraganaCharacters.length)
    return hiraganaCharacters[randomIndex]
  }

  const checkUserInput = () => {
    if (userInput === HIRAGANA[currentHiragana]) {
      // User input is correct 
      setShowCorrectAnswer(true)

      // Decrease the error count for the current Hiragana (if it's positive)
      if (hiraganaErrors[currentHiragana] > 0) {
        const updatedErrors = { ...hiraganaErrors }
        updatedErrors[currentHiragana] -= 1
        updateHiraganaErrors(updatedErrors)
      } else {
        if (correctCount < HIRAGANA_LEN) {
          setCorrectCount(correctCount + 1)
        }
      }
    } else {
      // User input is incorrect 
      setShowCorrectAnswer(false)

      // Increase the error count for the current Hiragana
      const updatedErrors = { ...hiraganaErrors }
      updatedErrors[currentHiragana] = (updatedErrors[currentHiragana] || 0) + 1
      updateHiraganaErrors(updatedErrors)
    }

    setLastHiragana(currentHiragana)
    // Play the audio pronunciation of the Hiragana character (correct one)
    playAudio(currentHiragana)

    // Clear user input
    setUserInput('')

    // Move to the next Hiragana character
    const randomHiragana = getRandomHiragana(hiraganaErrors)
    setCurrentHiragana(randomHiragana)
  }

  const playAudio = (hiragana) => {
    //play audio
    const audio = new Audio(`audio/${HIRAGANA[hiragana]}.mp3`) // Get the audio file path based on the Hiragana character
    audio.play()
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      checkUserInput()
    }
  }

  const calculateAccuracy = () => {
    const accuracy = (correctCount * 100 / HIRAGANA_LEN)
    return accuracy.toFixed() + '%'
  }

  const updateHiraganaErrors = (errors) => {
    const entries = Object.entries(errors).filter(([, value]) => value !== 0)
    setWrongCount(entries.length)

    const sortedEntries = entries.sort((a, b) => b[1] - a[1])
    const sortedErrors = Object.fromEntries(sortedEntries)

    setHiraganaErrors(sortedErrors)
    // Save the updated errors to localStorage
    localStorage.setItem('hiraganaErrors', JSON.stringify(sortedErrors))
  }

  const reset = () => {
    updateHiraganaErrors({})
    setUserInput('')
  }

  return (<div className="flex flex-col items-center">
    <h1 className="text-9xl mb-10">{currentHiragana}</h1>
    <div className="bg-white p-6">
      <label className='mr-2'>Romaji:</label>
      <input
        type="text"
        className="border border-gray-300 mr-2 p-2 text-xl mb-4"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder=""
        onKeyDown={handleKeyPress}
      />
      <button
        className="bg-green-500 text-white mr-2 py-2 px-4 text-xl hover:bg-green-700"
        onClick={checkUserInput}
      >
        Check
      </button>
      {
        lastHiragana && (showCorrectAnswer ? (
          <p className="text-green-500 text-2xl mt-4">✅ {lastHiragana} - {HIRAGANA[lastHiragana]} </p>
        ) : (
          <p className="text-red-500 text-2xl mt-4">❌ {lastHiragana} - {HIRAGANA[lastHiragana]} </p>
        ))
      }
      <hr />
      <p className="text-l mt-4">Correct: {correctCount}, Wrong: {wrongCount}, Accuracy: {calculateAccuracy()} </p>
      {wrongCount > 0 && (<h3 className="text-l mt-4 text-red-500">Errors:</h3>)}
      <ul className="text-red-500">
        {Object.entries(hiraganaErrors).map(([hiragana, errorCount]) => (
          <li key={hiragana}>{hiragana}: {errorCount}</li>
        ))}
      </ul>

      <button
        className="bg-amber-500 text-white mt-4 py-2 px-4 text-xl hover:bg-amber-700"
        onClick={reset}
      >
        Reset
      </button>
    </div>
    <a
      className="mt-4 link"
      href="https://github.com/coolcode/hira-game-js"
      target="_blank"
      rel="noopener noreferrer"
    >
      Source Code
    </a>
  </div>
  )
}

function App() {
  return (
    <div class="bg-gray-200">
      <header class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">
            &nbsp;&nbsp;/\_/\
          </h1>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">( o.o )
          </h1>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900">
            あいうえお Hiragana Learning Game
          </h1>
        </div>
      </header>
      <main>
        <div class="h-screen mx-auto max-w-8xl py-6 sm:px-6 lg:px-8">
          <HiraganaGame />
        </div>
      </main>
      <footer class="bg-white shadow flex flex-col items-center justify-center">

      </footer>
    </div>
  )
}

export default App
