// Entrypoint for PermEq
import { tokenize } from "./lexer";
import { parseLines } from "./parser";
import { interpret, evalExpr } from "./interpreter";
import { Environment } from "./environment";

// Example program:
const code = `
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

env.set("a", 7);
// Re-evaluate persistent bindings again after changing a
env.reevaluateAll(function(expr) { return evalExpr(expr, env); });

console.log("After changing a to 7:");
console.log("a =", env.get("a"));
console.log("b =", env.get("b"));