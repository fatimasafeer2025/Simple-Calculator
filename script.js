const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.getAttribute('data-value');

    if (value === 'clear') {
      currentInput = '';
      display.value = '';
      return;
    }

    if (value === '=') {
      try {
        // eslint-disable-next-line no-eval
        currentInput = evaluateExpression(currentInput).toString();
        display.value = currentInput;
      } catch (error) {
        display.value = 'Error';
        currentInput = '';
      }
      return;
    }

    currentInput += value;
    display.value = currentInput;
  });
});

function evaluateExpression(expr) {
  // Safe-ish evaluation using Function instead of eval
  if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
    throw new Error('Invalid characters in expression');
  }
  return Function('"use strict"; return (' + expr + ')')();
}

document.addEventListener('keydown', (e) => {
  if (/[0-9+\-*/.]/.test(e.key)) {
    currentInput += e.key;
    display.value = currentInput;
  } else if (e.key === 'Enter') {
    document.querySelector('.equals').click();
  } else if (e.key === 'Backspace') {
    currentInput = currentInput.slice(0, -1);
    display.value = currentInput;
  } else if (e.key === 'Escape') {
    document.querySelector('.clear').click();
  }
});