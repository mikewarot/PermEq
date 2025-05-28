// Entrypoint for PermEq
import { tokenize } from "./lexer";
import { parse } from "./parser";
import { interpret, evalExpr } from "./interpreter";
import { Environment } from "./environment";

// Example program:
const code = `
a = 2 + 2
b ≡ a * 3
a = 10
`;

// Tokenize each line separately, then parse all statements together
const lines = code.trim().split('\n').map(line => line.trim()).filter(Boolean);
const allTokens: string[][] = lines.map(line => tokenize(line));
const statements = allTokens.flatMap(tokens => parse(tokens));
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