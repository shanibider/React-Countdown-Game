import { forwardRef, useImperativeHandle, useRef } from 'react';
import { createPortal } from 'react-dom';

// Define the ResultModal component using forwardRef to access its methods from the parent component
// Here i destructured the props and added the 'remainingTime' prop
const ResultModal = forwardRef(function ResultModal(
  { targetTime, remainingTime, onReset },  ref) {

  const dialog = useRef();   // Create a ref to access the dialog element

  // Calculate if the user lost and the formatted remaining time
  const userLost = remainingTime <= 0;
  const formattedRemainingTime = (remainingTime / 1000).toFixed(2); // Convert to seconds
  const score = Math.round((1 - remainingTime / (targetTime * 1000)) * 100); // Calculate score
  // remainingTime / 1000 = 2000 / 1000 = 2
  // .toFixed(2) converts 2 to "2.00"
  // formattedRemainingTime will be "2.00"
  // remainingTime / (targetTime * 1000) = 2000 / (10 * 1000) = 2000 / 10000 = 0.2
  // 1 - 0.2 = 0.8
  // 0.8 * 100 = 80
  // Math.round(80) = 80
  // score will be 80

 
  // Use useImperativeHandle hook to expose a custom open method to parent component (TimerChallenge)
  useImperativeHandle(ref, () => {
    return {
      // This method is used to show the modal dialog when called.
      open() {
        dialog.current.showModal(); // Show the modal dialog
      },
    };
  });


  // createPortal function is used to render the modal in a different part of the DOM.
  // This allows the modal to cover other content and not be limited by the parent component's styling or structure.
  return createPortal(
    // Render the dialog element using createPortal to attach it to the modal container in the DOM
    <dialog ref={dialog} className="result-modal">

    {/* Output message conditionally if userLost is true. */}
      {userLost && <h2>You lost</h2>}
      {!userLost && <h2>Your Score: {score}</h2>}
      <p>
        The target time was <strong>{targetTime} seconds.</strong>
      </p>
      <p>
        You stopped the timer with{' '}
        <strong>{formattedRemainingTime} seconds left.</strong>
      </p>

      {/* Form to handle the reset action.
      onSubmit triggered whenever the form is sumbitted */}
      <form method="dialog" onSubmit={onReset}>
        <button>Close</button>
      </form>
    </dialog>,
    document.getElementById('modal') // Attach the modal to the DOM element with id 'modal'
  );
});

export default ResultModal;
