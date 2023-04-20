import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import "./style.css"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollcount,setRollcount] = React.useState(0)
    const [time,setTime] = React.useState(0)
    const [minrollcount,setMinrollcount] = React.useState(0)
    const [mintime,setMintime] = React.useState(0)
    
    React.useEffect(() => {
        let intervalId;
        if (!tenzies) {
          intervalId = setInterval(() => {
            setTime((time) => time + 1);
          }, 1000);
        }
        return () => clearInterval(intervalId);
      }, [tenzies]);
    
      
      
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            const games_rollcount = localStorage.getItem("games_rollcount")
            const games_time = localStorage.getItem("games_time")
            console.log(rollcount)
            if(games_rollcount){
                const rollcount_array = JSON.parse(games_rollcount)
                console.log(rollcount_array)
                rollcount_array.push(rollcount)
                localStorage.setItem("games_rollcount",JSON.stringify(rollcount_array))
            }
            else{
                localStorage.setItem("games_rollcount",JSON.stringify([rollcount]))
            }
            if(games_time){
                const time_array = JSON.parse(games_time)
                time_array.push(time)
                localStorage.setItem("games_time",JSON.stringify(time_array))
            }
            else{
                localStorage.setItem("games_time",JSON.stringify([time]))
            }
            setMinrollcount(Math.min(...JSON.parse(localStorage.getItem("games_rollcount")).map(Number)))
            setMintime(Math.min(...JSON.parse(localStorage.getItem("games_time")).map(Number)))
            setTenzies(true)
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
            setRollcount(rollcount + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()}))
            
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }

    function newgame() {
        setDice(allNewDice())
        setTenzies(false)
        setRollcount(0)
        setTime(0)   
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <div>
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={tenzies ? newgame :rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
        <div className = "stats">
        <h2> Roll Count : {rollcount} counts</h2>
        <h2> Best Counts: {minrollcount} counts</h2>
        <h2> Time Taken : {time}s</h2>
        <h2> Best Time : {mintime}s</h2>
       </div>
       </div>
        
    )
}