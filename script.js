const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const keys = document.querySelector(".keys");

let current = "0";
let previous = null;
let operator = null;
let justEvaluated = false;

function updateDisplay() {
  resultEl.textContent = current;
  expressionEl.textContent = previous !== null && operator
    ? `${previous} ${operator}`
    : "";
}

function inputDigit(digit) {
  if (justEvaluated) {
    current = digit === "." ? "0." : digit;
    justEvaluated = false;
    return;
  }
  if (digit === "." && current.includes(".")) return;
  if (current === "0" && digit !== ".") {
    current = digit;
  } else {
    current += digit;
  }
}

function chooseOperator(op) {
  if (operator && !justEvaluated) {
    evaluate();
  }
  previous = current;
  operator = op;
  current = "0";
  justEvaluated = false;
}

function evaluate() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  switch (operator) {
    case "+": result = a + b; break;
    case "−": result = a - b; break;
    case "×": result = a * b; break;
    case "÷": result = b === 0 ? NaN : a / b; break;
    default: return;
  }

  current = Number.isNaN(result) ? "Error" : trimResult(result);
  previous = null;
  operator = null;
  justEvaluated = true;
}

function trimResult(num) {
  return parseFloat(num.toFixed(10)).toString();
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justEvaluated = false;
}

function backspace() {
  if (justEvaluated) return clearAll();
  current = current.length > 1 ? current.slice(0, -1) : "0";
}

function percent() {
  current = trimResult(parseFloat(current) / 100);
}

keys.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.num !== undefined) {
    inputDigit(btn.dataset.num);
  } else if (btn.dataset.op) {
    chooseOperator(btn.dataset.op);
  } else if (btn.dataset.action === "equals") {
    evaluate();
  } else if (btn.dataset.action === "clear") {
    clearAll();
  } else if (btn.dataset.action === "backspace") {
    backspace();
  } else if (btn.dataset.action === "percent") {
    percent();
  }

  updateDisplay();
});

const keyMap = {
  "+": "+", "-": "−", "*": "×", "/": "÷",
};

document.addEventListener("keydown", (e) => {
  if (/^[0-9]$/.test(e.key)) {
    inputDigit(e.key);
  } else if (e.key === ".") {
    inputDigit(".");
  } else if (keyMap[e.key]) {
    chooseOperator(keyMap[e.key]);
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    evaluate();
  } else if (e.key === "Backspace") {
    backspace();
  } else if (e.key === "Escape") {
    clearAll();
  } else if (e.key === "%") {
    percent();
  } else {
    return;
  }
  updateDisplay();
});

updateDisplay();
