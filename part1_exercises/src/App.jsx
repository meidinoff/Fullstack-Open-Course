import { useState } from 'react'

const Button = ({ onClick, text }) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const StatLine = ({ text, stat }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{stat}</td>
    </tr>
  )
}

const Stats = ({ good, neutral, bad, total, average, positive }) => {
  if (total < 1) {
    return (
      <p>No feedback given</p>
    )
  } else {
    return (
      <div>
        <table>
          <tbody>
        <StatLine text='good' stat={good} />
        <StatLine text='neutral' stat={neutral} />
        <StatLine text='bad' stat={bad} />
        <StatLine text='all' stat={total} />
        <StatLine text='average' stat={average} />
        <StatLine text='positive' stat={positive} />
          </tbody>
        </table>
      </div>
    )
  }
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  
  let total = good + neutral + bad
  let average = 0
  let positive = 0
  
  if (total > 0) {
    average = (good - bad) / total
    positive = (good / total) * 100
  }
  
  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  return (
    <div>
        <h1>give feedback</h1>
        <Button onClick={handleGood} text='good' />
        <Button onClick={handleNeutral} text='neutral' />
        <Button onClick={handleBad} text='bad' />
        <h1>statistics</h1>
        <Stats good={good} neutral={neutral} bad={bad} total={total} average={average} positive={positive} />
    </div>
  )
}

export default App