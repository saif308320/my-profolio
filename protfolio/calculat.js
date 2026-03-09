const display = document.getElementById('display');

function appendValue(val) {
  if (display.value === '0' && val !== '.') {
    display.value = val;
  } else {
    display.value += val;
  }
}

function clearDisplay() {
  display.value = '';
}

function deleteChar() {
  display.value = display.value.slice(0, -1);
  if (display.value === '') display.value = '0';
}

function calculate() {
  try {
    // Evaluate expression safely
    const result = Function(`return ${display.value}`)();
    display.value = result;
  } catch {
    display.value = 'Error';
  }
}
