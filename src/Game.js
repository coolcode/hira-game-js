import React, { useState, useEffect } from 'react'

const Game = ({ symbols, symbolType = 'HIRAGANA' }) => {
    const numberOfSymbols = Object.keys(symbols).length
    const storageKey = `FailedSymbols_${symbolType}`

    const [currentSymbol, setCurrentSymbol] = useState('')
    const [lastSymbol, setLastSymbol] = useState('')
    const [userInput, setUserInput] = useState('')
    const [correctCount, setCorrectCount] = useState(0)
    const [wrongCount, setWrongCount] = useState(0)
    const [showCorrectAnswer, setShowCorrectAnswer] = useState(false)
    const [failedSymbols, setFailedSymbols] = useState({})
    const [learnedSymbols, setLearnedSymbols] = useState(new Set())

    useEffect(() => {
        reset()
        // Load errors from localStorage on component mount
        const storedErrors = JSON.parse(localStorage.getItem(storageKey)) || {}
        updateFailedSymbols(storedErrors)

        // Randomly select a Symbol character
        const randomSymbol = getRandomSymbol(storedErrors)
        setCurrentSymbol(randomSymbol)
        // eslint-disable-next-line 
    }, [symbolType])

    const getRandomSymbol = (errors) => {
        const errorKeys = Object.keys(errors)
        const symbolKeys = errorKeys.length > 0 && Math.floor(Math.random() * 100) < 10 * errorKeys.length ? errorKeys : Object.keys(symbols)
        const randomIndex = Math.floor(Math.random() * symbolKeys.length)
        return symbolKeys[randomIndex]
    }

    const checkUserInput = () => {
        if (userInput === symbols[currentSymbol]) {
            // User input is correct 
            setShowCorrectAnswer(true)

            // Decrease the error count for the current Symbol (if it's positive)
            if (failedSymbols[currentSymbol] > 0) {
                const updatedErrors = { ...failedSymbols }
                updatedErrors[currentSymbol] -= 1
                updateFailedSymbols(updatedErrors)
            } else {
                if (correctCount < numberOfSymbols) {
                    setCorrectCount(correctCount + 1)
                }
            }
            if (!learnedSymbols.has(currentSymbol)) {
                learnedSymbols.add(currentSymbol)
                setLearnedSymbols(learnedSymbols)
            }
        } else {
            // User input is incorrect 
            setShowCorrectAnswer(false)

            // Increase the error count for the current Symbol
            const updatedErrors = { ...failedSymbols }
            updatedErrors[currentSymbol] = (updatedErrors[currentSymbol] || 0) + 1
            updateFailedSymbols(updatedErrors)
            if (learnedSymbols.has(currentSymbol)) {
                learnedSymbols.delete(currentSymbol)
                setLearnedSymbols(learnedSymbols)
            }
        }

        setLastSymbol(currentSymbol)
        // Play the audio pronunciation of the Symbol character (correct one)
        playAudio(currentSymbol)

        // Clear user input
        setUserInput('')

        // Move to the next Symbol character
        const randomSymbol = getRandomSymbol(failedSymbols)
        setCurrentSymbol(randomSymbol)
    }

    const playAudio = (symbol) => {
        //play audio
        const audio = new Audio(`audio/${symbols[symbol]}.mp3`) // Get the audio file path based on the Symbol character
        audio.play()
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            checkUserInput()
        }
    }

    const calculateAccuracy = () => {
        const accuracy = (correctCount * 100 / numberOfSymbols)
        return accuracy.toFixed() + '%'
    }

    const updateFailedSymbols = (errors) => {
        const entries = Object.entries(errors).filter(([, value]) => value !== 0)
        setWrongCount(entries.length)

        const sortedEntries = entries.sort((a, b) => b[1] - a[1])
        const sortedErrors = Object.fromEntries(sortedEntries)

        setFailedSymbols(sortedErrors)
        // Save the updated errors to localStorage
        localStorage.setItem(storageKey, JSON.stringify(sortedErrors))
    }

    const reset = (clearFailedSymbol = false) => {
        setLastSymbol('')
        setCorrectCount(0)
        setWrongCount(0)
        setLearnedSymbols(new Set())
        setShowCorrectAnswer(false)
        setUserInput('')
        if (clearFailedSymbol) {
            updateFailedSymbols({})
        }
    }

    return (<div className="flex flex-col items-center">
        <h1 className="text-9xl mb-10">{currentSymbol}</h1>
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
                lastSymbol && (showCorrectAnswer ? (
                    <p className="text-green-500 text-2xl mt-4">✅ {lastSymbol} - {symbols[lastSymbol]} </p>
                ) : (
                    <p className="text-red-500 text-2xl mt-4">❌ {lastSymbol} - {symbols[lastSymbol]} </p>
                ))
            }
            <hr />
            <p className="text-l mt-4">Correct: {correctCount}, Wrong: {wrongCount}, Accuracy: {calculateAccuracy()} </p>
            {wrongCount > 0 && (<h3 className="text-l mt-4 text-red-500">Errors:</h3>)}
            <ul className="text-red-500">
                {Object.entries(failedSymbols).map(([symbol, errorCount]) => (
                    <li key={symbol}><span>{symbol}: {errorCount}</span><button className="px-2 text-green-500" title={symbols[symbol]} onClick={() => playAudio(symbol)} >🎵</button></li>
                ))}
            </ul>

            <button
                className="bg-amber-500 text-white mt-4 py-2 px-4 text-xl hover:bg-amber-700"
                onClick={() => reset(true)}
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

export default Game
