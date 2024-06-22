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
      {/* Display the entered player name or a default message if not set */}
      <h2>Welcome {enteredPlayerName ?? 'unknown entity'}</h2>
      <p>
        {/* Attach the ref to the input element to access its value */}
        <input ref={playerName} type="text" />
        <button onClick={handleClick}>Set Name</button>
      </p>
    </section>
  );
}
