#!/usr/bin/env node

// Supported operations: addition (+), subtraction (-), multiplication (*), division (/),
// modulo (%), exponentiation (^), and square root (sqrt).
const operationAliases = {
  add: "+",
  "+": "+",
  subtract: "-",
  "-": "-",
  multiply: "*",
  "*": "*",
  divide: "/",
  "/": "/",
  modulo: "%",
  "%": "%",
  power: "^",
  "^": "^",
  squareRoot: "sqrt",
  sqrt: "sqrt",
};

function modulo(a, b) {
  if (b === 0) {
    throw new Error("Cannot calculate modulo by zero.");
  }

  return a % b;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error("Cannot calculate the square root of a negative number.");
  }

  return Math.sqrt(n);
}

const operations = {
  "+": (left, right) => left + right,
  "-": (left, right) => left - right,
  "*": (left, right) => left * right,
  "/": (left, right) => {
    if (right === 0) {
      throw new Error("Cannot divide by zero.");
    }

    return left / right;
  },
  "%": modulo,
  "^": power,
  sqrt: squareRoot,
};

const usage =
  "Usage: node src/calculator.js <operation> <number1> [number2]\n" +
  "Operations: add (+), subtract (-), multiply (*), divide (/), modulo (%), " +
  "power (^), squareRoot (sqrt)";

function parseOperand(value, label) {
  const number = Number(value);
  if (value.trim() === "" || !Number.isFinite(number)) {
    throw new Error(`${label} must be a finite number.`);
  }

  return number;
}

function calculate(operation, left, right) {
  if (!Number.isFinite(left)) {
    throw new Error("Operands must be finite numbers.");
  }

  const symbol = operationAliases[operation];
  if (!symbol) {
    throw new Error(`Unsupported operation: ${operation}`);
  }

  if (symbol === "sqrt") {
    if (right !== undefined) {
      throw new Error("Square root accepts one operand.");
    }

    return operations[symbol](left);
  }

  if (!Number.isFinite(right)) {
    throw new Error("Operands must be finite numbers.");
  }

  return operations[symbol](left, right);
}

function main(args) {
  if (args.length < 2 || args.length > 3) {
    throw new Error(usage);
  }

  const [operation, firstValue, secondValue] = args;
  const symbol = operationAliases[operation];
  if (args.length !== (symbol === "sqrt" ? 2 : 3)) {
    throw new Error(usage);
  }

  const left = parseOperand(firstValue, "First operand");
  const right =
    secondValue === undefined
      ? undefined
      : parseOperand(secondValue, "Second operand");
  console.log(calculate(operation, left, right));
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    if (error.message.startsWith("Unsupported operation:")) {
      console.error(usage);
    }
    process.exitCode = 1;
  }
}

module.exports = { calculate, modulo, power, squareRoot };
