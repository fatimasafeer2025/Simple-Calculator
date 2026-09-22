const display = document.getElementById('display');
const memoryIndicator = document.getElementById('memoryIndicator');
const buttons = document.querySelectorAll('.btn');

let currentInput = '';
let memoryValue = 0;

function updateMemoryIndicator() {
  memoryIndicator.textContent = memoryValue !== 0 ? 'M' : '';
}

function evaluateExpression(expr) {
  if (!/^[0-9+\-*/().\s]+$/.test(expr)) {
    throw new Error('Invalid characters in expression');
  }
  return Function('"use strict"; return (' + expr + ')')();
}

function handleAction(value) {
  switch (value) {
    case 'clear':
      currentInput = '';
      display.value = '';
      break;

    case 'backspace':
      currentInput = currentInput.slice(0, -1);
      display.value = currentInput;
      break;

    case '=':
      try {
        currentInput = evaluateExpression(currentInput).toString();
        display.value = currentInput;
      } catch (error) {
        display.value = 'Error';
        currentInput = '';
      }
      break;

    case '%':
      try {
        currentInput = (evaluateExpression(currentInput) / 100).toString();
        display.value = currentInput;
      } catch (error) {
        display.value = 'Error';
        currentInput = '';
      }
      break;

    case 'sqrt':
      try {
        const result = Math.sqrt(evaluateExpression(currentInput));
        if (isNaN(result)) throw new Error('Invalid input for square root');
        currentInput = result.toString();
        display.value = currentInput;
      } catch (error) {
        display.value = 'Error';
        currentInput = '';
      }
      break;

    case 'sign':
      try {
        currentInput = (evaluateExpression(currentInput) * -1).toString();
        display.value = currentInput;
      } catch (error) {
        display.value = 'Error';
        currentInput = '';
      }
      break;

    case 'mc':
      memoryValue = 0;
      updateMemoryIndicator();
      break;

    case 'mr':
      currentInput = memoryValue.toString();
      display.value = currentInput;
      break;

    case 'm+':
      try {
        memoryValue += evaluateExpression(currentInput);
        updateMemoryIndicator();
      } catch (error) {
        display.value = 'Error';
      }
      break;

    case 'm-':
      try {
        memoryValue -= evaluateExpression(currentInput);
        updateMemoryIndicator();
      } catch (error) {
        display.value = 'Error';
      }
      break;

    default:
      currentInput += value;
      display.value = currentInput;
  }
}

buttons.forEach(button => {
  button.addEventListener('click', () => {
    handleAction(button.getAttribute('data-value'));
  });
});

document.addEventListener('keydown', (e) => {
  if (/[0-9+\-*/.]/.test(e.key)) {
    currentInput += e.key;
    display.value = currentInput;
  } else if (e.key === 'Enter') {
    handleAction('=');
  } else if (e.key === 'Backspace') {
    handleAction('backspace');
  } else if (e.key === 'Escape') {
    handleAction('clear');
  } else if (e.key === '%') {
    handleAction('%');
  }
});

updateMemoryIndicator();