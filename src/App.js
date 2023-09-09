import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Game from './Game'

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

const KATAKANA = {
  'ア': 'a', 'イ': 'i', 'ウ': 'u', 'エ': 'e', 'オ': 'o',
  'カ': 'ka', 'キ': 'ki', 'ク': 'ku', 'ケ': 'ke', 'コ': 'ko',
  'サ': 'sa', 'シ': 'shi', 'ス': 'su', 'セ': 'se', 'ソ': 'so',
  'タ': 'ta', 'チ': 'chi', 'ツ': 'tsu', 'テ': 'te', 'ト': 'to',
  'ナ': 'na', 'ニ': 'ni', 'ヌ': 'nu', 'ネ': 'ne', 'ノ': 'no',
  'ハ': 'ha', 'ヒ': 'hi', 'フ': 'fu', 'ヘ': 'he', 'ホ': 'ho',
  'マ': 'ma', 'ミ': 'mi', 'ム': 'mu', 'メ': 'me', 'モ': 'mo',
  'ヤ': 'ya', 'ユ': 'yu', 'ヨ': 'yo',
  'ラ': 'ra', 'リ': 'ri', 'ル': 'ru', 'レ': 're', 'ロ': 'ro',
  'ワ': 'wa', 'ヲ': 'wo',
  'ン': 'n',
}


function App() {
  return (
    <Router>
      <div className="bg-gray-100 ">
        <header className="bg-white shadow">
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 px-2">
                  /\_/\
                </h1>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">( o.o )</h1>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">あいうえお</h1>
                <h2 className="text-xl">Learning Game</h2>
              </div>
              <div className="block">
                <ul className="">
                  {/* <li>
                    <Link to="/" className="text-gray-900 hover:text-blue-500 transition duration-300">Home</Link>
                  </li> */}
                  <li>
                    <Link to="/hiragana" className="text-gray-900 hover:text-blue-500 transition duration-300">HIRAGANA</Link>
                  </li>
                  <li>
                    <Link to="/katakana" className="text-gray-900 hover:text-blue-500 transition duration-300">KATAKANA</Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </header>
        <main>
          <div className="h-screen mx-auto max-w-8xl py-6 sm:px-6 lg:px-8">
            {/* <Game symbols={HIRAGANA} /> */}
            <Routes>
              <Route path="/" exact element={<Game symbols={HIRAGANA} symbolType='HIRAGANA' />} />
              <Route path="/hiragana" element={<Game symbols={HIRAGANA} symbolType='HIRAGANA' />} />
              <Route path="/katakana" element={<Game symbols={KATAKANA} symbolType='KATAKANA' />} />
            </Routes>
          </div>
        </main>
        <footer className="bg-white shadow flex flex-col items-center justify-center">

        </footer>
      </div>
    </Router>
  )
}

export default App
