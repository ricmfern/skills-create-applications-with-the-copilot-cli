const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");
const test = require("node:test");

const { calculate } = require("../calculator");
const calculatorPath = path.join(__dirname, "..", "calculator.js");

const imageExamples = [
  { operation: "+", left: 2, right: 3, expected: 5 },
  { operation: "-", left: 10, right: 4, expected: 6 },
  { operation: "*", left: 45, right: 2, expected: 90 },
  { operation: "/", left: 20, right: 5, expected: 4 },
];

for (const { operation, left, right, expected } of imageExamples) {
  test(`calculates ${left} ${operation} ${right}`, () => {
    assert.equal(calculate(operation, left, right), expected);
  });
}

const namedOperations = [
  { operation: "add", left: 2, right: 3, expected: 5 },
  { operation: "subtract", left: 10, right: 4, expected: 6 },
  { operation: "multiply", left: 45, right: 2, expected: 90 },
  { operation: "divide", left: 20, right: 5, expected: 4 },
];

for (const { operation, left, right, expected } of namedOperations) {
  test(`supports the ${operation} operation name`, () => {
    assert.equal(calculate(operation, left, right), expected);
  });
}

test("handles negative and fractional operands", () => {
  assert.equal(calculate("+", -2.5, 0.5), -2);
  assert.equal(calculate("-", -2, -5), 3);
  assert.equal(calculate("*", -3, 2.5), -7.5);
  assert.equal(calculate("/", 7.5, -2.5), -3);
});

test("handles zero as an operand", () => {
  assert.equal(calculate("+", 0, 3), 3);
  assert.equal(calculate("-", 3, 0), 3);
  assert.equal(calculate("*", 0, 3), 0);
  assert.equal(calculate("/", 0, 3), 0);
});

test("rejects division by zero for both operation forms", () => {
  assert.throws(() => calculate("/", 1, 0), /Cannot divide by zero/);
  assert.throws(() => calculate("divide", 1, 0), /Cannot divide by zero/);
});

test("rejects unsupported operations and non-finite operands", () => {
  assert.throws(() => calculate("%", 5, 2), /Unsupported operation: %/);
  assert.throws(() => calculate("+", Infinity, 2), /finite numbers/);
  assert.throws(() => calculate("+", 2, NaN), /finite numbers/);
  assert.throws(() => calculate("+", "2", 3), /finite numbers/);
});

test("CLI prints a result for a valid calculation", () => {
  const result = spawnSync(
    process.execPath,
    [calculatorPath, "*", "45", "2"],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0);
  assert.equal(result.stdout.trim(), "90");
  assert.equal(result.stderr, "");
});

test("CLI reports division by zero and exits unsuccessfully", () => {
  const result = spawnSync(
    process.execPath,
    [calculatorPath, "/", "20", "0"],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Cannot divide by zero/);
});

test("CLI rejects invalid operands and missing arguments", () => {
  const invalidOperand = spawnSync(
    process.execPath,
    [calculatorPath, "+", "nope", "2"],
    { encoding: "utf8" },
  );
  assert.equal(invalidOperand.status, 1);
  assert.match(invalidOperand.stderr, /First operand must be a finite number/);

  const missingArguments = spawnSync(process.execPath, [calculatorPath], {
    encoding: "utf8",
  });
  assert.equal(missingArguments.status, 1);
  assert.match(missingArguments.stderr, /Usage:/);
});
