import { tokenize } from "./lexer";
import { parseLines } from "./parser";
import { interpret, evalExpr } from "./interpreter";
import { Environment } from "./environment";
import * as fs from "fs";

// Get filename from command-line arguments
const filename = process.argv[2];

let code: string;
if (filename) {
  try {
    code = fs.readFileSync(filename, "utf-8");
  } catch (err) {
    console.error(`Error reading file "${filename}":`, err.message);
    process.exit(1);
  }
} else {
  // Fallback example program
  code = `
print "Hello, world!"
a = 2 + 2
b ≡ a * 3
print b
a = 10
print b

for i = 1 to 3
  print i
end
`;
}

// Split code into lines, tokenize each line, parse, and flatten all statements
const lines = code
  .trim()
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean);
const allTokens: string[][] = lines.map(line => tokenize(line));
const statements = parseLines(allTokens);
const env = new Environment();

interpret(statements, env);
// Re-evaluate persistent bindings so b gets updated
env.reevaluateAll(function(expr) { return evalExpr(expr, env); });

console.log("PermEq interpreter initialized.");
console.log("a =", env.get("a"));
console.log("b =", env.get("b"));

// Demo: change a and re-evaluate
env.set("a", 7);
env.reevaluateAll(function(expr) { return evalExpr(expr, env); });
console.log("After changing a to 7:");
console.log("a =", env.get("a"));
console.log("b =", env.get("b"));