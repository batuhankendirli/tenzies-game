import React from 'react';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import ReactConfetti from 'react-confetti';

function App() {
  const [seconds, setSeconds] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);

  const [startTimer, setStartTimer] = React.useState(false);
  let timer;
  React.useEffect(() => {
    if (startTimer) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
        if (seconds === 59) {
          setMinutes((prevMinutes) => prevMinutes + 1);
          setSeconds(0);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [seconds, startTimer]);

  function startTime() {
    setStartTimer(true);
    return () => clearInterval(timer);
  }

  function stopTime() {
    setStartTimer(false);
    return () => clearInterval(timer);
  }

  function allNewDice() {
    const arr = [];
    for (let i = 0; i < 10; i++) {
      arr.push({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid(),
      });
    }
    return arr;
  }

  function holdDice(id) {
    if (seconds === 0 && minutes === 0) {
      startTime();
    }
    setNumbers((prevNumbers) => {
      return prevNumbers.map((num) => {
        return num.id === id
          ? {
              ...num,
              isHeld: !num.isHeld,
            }
          : num;
      });
    });
  }

  const [numbers, setNumbers] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);

  const [bestTime, setBestTime] = React.useState(
    () => JSON.parse(localStorage.getItem('bestTime')) || []
  );

  const [rolls, setRolls] = React.useState(0);

  function rollDice() {
    if (tenzies) {
      setNumbers(allNewDice());
      setTenzies(false);
      setRolls(0);
      setSeconds(0);
      setMinutes(0);
    } else {
      setRolls((prevState) => prevState + 1);
      setNumbers((prevState) => {
        return prevState.map((num) => {
          return num.isHeld
            ? num
            : {
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid(),
              };
        });
      });
    }
  }

  React.useEffect(() => {
    const allHeld = numbers.every((num) => num.isHeld);
    const firstValue = numbers[0].value;
    const allSameValue = numbers.every((num) => num.value === firstValue);

    if (allHeld && allSameValue) {
      const totalTime = minutes > 0 ? minutes * 60 + seconds : seconds;
      console.log(totalTime);
      stopTime();
      setBestTime((prevTime) => {
        if (prevTime * 1 === 0) {
          return totalTime;
        } else {
          return prevTime > totalTime ? totalTime : prevTime;
        }
      });
      setTenzies(true);
      localStorage.setItem('bestTime', JSON.stringify(bestTime));
      console.log('You won!');
    }
  }, [numbers, startTimer]);

  const diceElements = numbers.map((dice) => (
    <Die
      number={dice.value}
      key={dice.id}
      isHeld={dice.isHeld}
      hold={() => holdDice(dice.id)}
    />
  ));

  return (
    <main className="app">
      {tenzies && <ReactConfetti />}
      <div className="box-inside">
        <h1 className="header">Tenzies</h1>
        {rolls > 0 && (
          <p className="total-rolls">
            You have rolled {rolls} {rolls === 1 ? 'time' : 'times'}
          </p>
        )}
        {bestTime > 0 && (
          <p className="best-time">
            <span>Your best time:</span>

            {bestTime >= 60
              ? ` ${
                  Math.floor(bestTime / 60) < 10
                    ? '0' + Math.floor(bestTime / 60)
                    : Math.floor(bestTime / 60)
                }:${bestTime % 60 < 10 ? '0' + (bestTime % 60) : bestTime % 60}`
              : ` 00:${bestTime < 10 ? '0' + bestTime : bestTime}`}
          </p>
        )}
        <p className="timer">
          {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </p>
        <p className="paragraph">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
        <div className="die-wrapper">{diceElements}</div>
        <button className="roll-button" onClick={rollDice}>
          {tenzies ? 'New Game' : 'Roll'}
        </button>
      </div>
    </main>
  );
}

export default App;
