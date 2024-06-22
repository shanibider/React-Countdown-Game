# React Countdown Game 🕝

[![Javascript](https://img.shields.io/badge/JavaScript-★★★★★-orange)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![React](https://img.shields.io/badge/React-★★★★★-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-★★★★★-yellow)](https://vitejs.dev/)

This is a simple countdown game built with React <img height=25px src="https://skillicons.dev/icons?i=react"> . The primary focus of this project is to demonstrate the use of **`useRef`**.
The game counts down from a specified time and updates the UI in real-time.

## Features 🚀
- Real-time countdown timer
- Start, and reset functionality
- Simple and clean user interface
- Focus on the `useRef` hook for managing timer state and modal visibility

## Technologies Used 💻
[![My Skills](https://skillicons.dev/icons?i=nodejs,express,js,react,html,css)](https://skillicons.dev)
- React
- JavaScript (ES6+)
- HTML5
- CSS3


## How It Works 📌
#### Using `useRef` for Timer Management and `Modal` Visibility
In this project, **`useRef`** is used to manage the timer's state and control the visibility of the result modal. <br>
Unlike **`useState`**, which triggers a re-render when updated, `useRef` provides a way to persist values between renders without causing a re-render.


### Explanation 🔎
- [x] `useRef` is used to create `timer` and `dialog` references for managing the interval timer and modal visibility.
- [x] `useImperativeHandle` in the `ResultModal` component allows the parent component to control the modal's visibility by exposing the `open` method.
- [x] The `TimerChallenge` component manages the countdown logic and interacts with the `ResultModal` component through refs.

---

## Parent-Child relationship 👨‍👧
Between `TimerChallenge` and `ResultModal`:

1. **Parent-Child Relationship**:
   - **`TimerChallenge`**: The parent component that holds the timer logic and manages the state of the challenge.
   - **`ResultModal`**: The child component that displays the result modal. `TimerChallenge` controls it using a ref.

```javascript
import { useState, useRef } from 'react';
import ResultModal from './ResultModal.jsx';

export default function TimerChallenge({ title, targetTime }) {
  const dialog = useRef(); 
  
    if (timeRemaining <= 0) {
    clearInterval(timer.current); 
    dialog.current.open(); // Calls the open method 
  }
  ...
}
```

```javascript
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

const ResultModal = forwardRef(function ResultModal(
  { targetTime, remainingTime, onReset },  ref) {
      const dialog = useRef();
      ...
});
export default ResultModal;
```

2. **`useImperativeHandle`**:
   - This hook is used inside `ResultModal` to expose a custom `open` method.
   - This method is used to show the modal dialog when called.

 ```javascript
 useImperativeHandle(ref, () => {
    return {
      // This method is used to show the modal dialog when called.
      open() {
        dialog.current.showModal(); // Show the modal dialog
      },
    };  
});
```

3. **`createPortal`**:
   - The `createPortal` function is used to render the modal in a different part of the DOM.
   - This allows the modal to overlay other content and not be constrained by the parent component's styling or structure.

```javascript
return createPortal(
    <dialog ref={dialog} className="result-modal">
    ...
    </dialog>,
    document.getElementById('modal') // Attach the modal to the DOM element with id 'modal'
  );
});
export default ResultModal;
```


### How They Interact
- **In `TimerChallenge`**:
  - A ref (`dialog`) is created using `useRef`.
  - This ref is passed to `ResultModal` using the `ref` attribute.
  - When the timer reaches zero, `dialog.current.open()` is called to show the modal.

- **In `ResultModal`**:
  - `useImperativeHandle` customizes the ref to expose the `open` method.
  - The `open` method uses `dialog.current.showModal()` to display the modal.

### Summary
- **Parent Component**: `TimerChallenge` is the parent component because it renders and controls `ResultModal`.
- **Child Component**: `ResultModal` is the child component, which uses `useImperativeHandle` to expose its `open` method to the parent component.
- **Interaction**: `TimerChallenge` can programmatically control `ResultModal` through the ref and the exposed `open` method, allowing it to open the modal when needed.


---

#### Brief explanation of the key parts of the code 📋:

### TimerChallenge Component
```javascript
import { useState, useRef } from 'react';
import ResultModal from './ResultModal.jsx';

export default function TimerChallenge({ title, targetTime }) {
  const timer = useRef();
  const dialog = useRef();
  const [timeRemaining, setTimeRemaining] = useState(targetTime * 1000);
  const timerIsActive = timeRemaining > 0 && timeRemaining < targetTime * 1000;

  if (timeRemaining <= 0) {
    clearInterval(timer.current);
    dialog.current.open();
  }

  function handleReset() {
    setTimeRemaining(targetTime * 1000);
  }

  function handleStart() {
    timer.current = setInterval(() => {
      setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 10);
    }, 10);
  }

  function handleStop() {
    dialog.current.open();
    clearInterval(timer.current);
  }

  return (
    <>
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
          <button onClick={timerIsActive ? handleStop : handleStart}>
            {timerIsActive ? 'Stop' : 'Start'} Challenge
          </button>
        </p>
        <p className={timerIsActive ? 'active' : undefined}>
          {timerIsActive ? 'Time is running...' : 'Timer inactive'}
        </p>
      </section>
    </>
  );
}
```
<br>

### ResultModal Component
```javascript
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

const ResultModal = forwardRef(function ResultModal(
  { targetTime, remainingTime, onReset },
  ref
) {
  const dialog = useRef();
  const userLost = remainingTime <= 0;
  const formattedRemainingTime = (remainingTime / 1000).toFixed(2);
  const score = Math.round((1 - remainingTime / (targetTime * 1000)) * 100);

  useImperativeHandle(ref, () => ({
    open() {
      dialog.current.showModal();
    },
  }));

  return createPortal(
    <dialog ref={dialog} className="result-modal">
      {userLost && <h2>You lost</h2>}
      {!userLost && <h2>Your Score: {score}</h2>}
      <p>
        The target time was <strong>{targetTime} seconds.</strong>
      </p>
      <p>
        You stopped the timer with <strong>{formattedRemainingTime} seconds left.</strong>
      </p>
      <form method="dialog" onSubmit={onReset}>
        <button>Close</button>
      </form>
    </dialog>,
    document.getElementById('modal')
  );
});

export default ResultModal;
```
<br>

### Player Component
```javascript
import { useState, useRef } from 'react';

export default function Player() {
  const playerName = useRef();
  const [enteredPlayerName, setEnteredPlayerName] = useState(null);

  function handleClick() {
    setEnteredPlayerName(playerName.current.value);
    playerName.current.value = '';
  }

  return (
    <section id="player">
      <h2>Welcome {enteredPlayerName ?? 'unknown entity'}</h2>
      <p>
        <input ref={playerName} type="text" />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  );
}
```
<br>

### App.jsx
```javascript
import Player from './components/Player.jsx';
import TimerChallenge from './components/TimerChallenge.jsx';

function App() {
  return (
    <>
      {/* Render the Player component */}
      <Player />
      <div id="challenges">
        {/* Render multiple TimerChallenge components with different 'target times' */}
        <TimerChallenge title="Easy" targetTime={1} />
        <TimerChallenge title="Not easy" targetTime={5} />
        <TimerChallenge title="Getting tough" targetTime={10} />
        <TimerChallenge title="Pros only" targetTime={15} />
      </div>
    </>
  );
}
export default App;


```
---
## Screenshots 🖼️
![refs](https://github.com/shanibider/React-Countdown-Game/assets/72359805/7d7e37d9-e3e0-4cec-9f1c-08ce37d5838b)

![refs1](https://github.com/shanibider/React-Countdown-Game/assets/72359805/358e4d8d-e7b7-4f59-bae8-7d0bc8954941)


---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/react-countdown-game.git
   ```
2. Navigate to the project directory:
   ```bash
   cd react-countdown-game
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm start
   ```
2. Open your browser and go to `http://localhost:5173`.

---

> Feel free to dive into the code to understand the implementation details. Happy coding! 🚀😊👩‍💻

## 📫 Connect with me 😊
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shani-bider/)
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://shanibider.onrender.com/)
[![gmail](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:shanibider@gmail.com)

<footer>
<p style="float:left; width: 20%;">
Copyright © Shani Bider, 2024
</p>
</footer>
