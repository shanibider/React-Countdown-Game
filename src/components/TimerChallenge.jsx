import { useState, useRef } from 'react';
// Uses ResultModal and passes a ref to it, This makes TimerChallenge the parent component of ResultModal. 
import ResultModal from './ResultModal.jsx'; 
// let timer;

export default function TimerChallenge({ title, targetTime }) {
  // Create refs to access the timer and dialog elements
  const timer = useRef();
  const dialog = useRef(); //This ref will passed to ResultModal using the ref attribute.

  // replace the previos 2 states to new state of remaining time
  const [timeRemaining, setTimeRemaining] = useState(targetTime * 1000);

  // Check if the timer is active
  const timerIsActive = timeRemaining > 0 && timeRemaining < targetTime * 1000;

  // When the timer reaches zero, the interval timer is stopped,
  // and a modal dialog is shown to indicate the end of the challenge.
  if (timeRemaining <= 0) {
    clearInterval(timer.current); // Built-in function that stops the timer associated with the interval ID stored in timer.current.
    // Calls the open method on dialog ref, which is custom method defined using 'useImperativeHandle' in ResultModal.
    // It opens the modal dialog to show the results.
    dialog.current.open(); 
  }


  // Resets the remaining time to the initial target time.
  function handleReset() {
    setTimeRemaining(targetTime * 1000); // Resets timeRemaining to its initial value. (targetTime is in seconds, so it convert it to ms)
  }


  // Starts the timer by setting up an interval that updates the remaining time every 10 ms, by 10 ms less.
  function handleStart() {
    // Built-in function that repeatedly executes a given function at specified intervals
    // (Every 10 ms) The interval ID is stored in timer.current.
    timer.current = setInterval(() => {
      // setTimeRemaining called with function that decrements the previous remaining time by 10 ms.
      // This updates the state every 10 ms, effectively running the timer.
      setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 10);
    }, 10); // Update the remaining time every 10ms
  }
  /* For example if the targetTime is 5 seconds, the initial timeRemaining will be 5000ms.
  After 10ms, the timeRemaining will be 4990ms, after 20ms it will be 4980ms, and so on. */


  // Stops the timer and opens the result modal.
  function handleStop() {
    dialog.current.open(); // Opens the modal dialog to show the results.
    clearInterval(timer.current); // Stops the interval timer to prevent further updates to timeRemaining.
  }

  return (
    <>
    {/* Render the ResultModal component and pass necessary props (remainingTime prop) */}
      <ResultModal
        ref={dialog}
        targetTime={targetTime}
        remainingTime={timeRemaining} 
        onReset={handleReset}
      />
      <section className="challenge">
        <h2>{title}</h2>
        <p className="challenge-time">
          {targetTime} second{targetTime > 1 ? 's' : ''}
        </p>
        <p>
          {/* Toggle button text and action based on timer status */}
          <button onClick={timerIsActive ? handleStop : handleStart}>
            {timerIsActive ? 'Stop' : 'Start'} Challenge
          </button>
        </p>
        {/* Display timer status */}
        <p className={timerIsActive ? 'active' : undefined}>
          {timerIsActive ? 'Time is running...' : 'Timer inactive'}
        </p>
      </section>
    </>
  );
}
