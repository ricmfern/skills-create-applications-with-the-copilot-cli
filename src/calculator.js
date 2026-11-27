#!/usr/bin/env node

// Supported operations: addition (+), subtraction (-), multiplication (*), and division (/).
const operationAliases = {
  add: "+",
  "+": "+",
  subtract: "-",
  "-": "-",
  multiply: "*",
  "*": "*",
  divide: "/",
  "/": "/",
};

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
};

const usage =
  "Usage: node src/calculator.js <operation> <number1> <number2>\n" +
  "Operations: add (+), subtract (-), multiply (*), divide (/)";

function parseOperand(value, label) {
  const number = Number(value);
  if (value.trim() === "" || !Number.isFinite(number)) {
    throw new Error(`${label} must be a finite number.`);
  }

  return number;
}

function calculate(operation, left, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error("Operands must be finite numbers.");
  }

  const symbol = operationAliases[operation];
  if (!symbol) {
    throw new Error(`Unsupported operation: ${operation}`);
  }

  return operations[symbol](left, right);
}

function main(args) {
  if (args.length !== 3) {
    throw new Error(usage);
  }

  const [operation, firstValue, secondValue] = args;
  const left = parseOperand(firstValue, "First operand");
  const right = parseOperand(secondValue, "Second operand");
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

module.exports = { calculate };
