// Entrypoint for PermEq
import { tokenize } from "./lexer";
import { parse } from "./parser";
import { interpret } from "./interpreter";
import { Environment } from "./environment";

// Example program:
const code = `
a = 2 + 2
b ≡ a * 3
a = 10
`;

const tokens = tokenize(code);
const statements = parse(tokens);
const env = new Environment();

interpret(statements, env);

console.log("PermEq interpreter initialized.");
console.log("a =", env.get("a"));
console.log("b =", env.get("b"));
// If you update a, you can re-run reevaluateAll to update b
env.set("a", 7);
env.reevaluateAll(expr => {
  // Need to re-evaluate using the updated environment
  return interpret(parse(tokenize("")), env), env.get("a")! * 3;
});
console.log("After changing a to 7:");
console.log("a =", env.get("a"));
console.log("b =", env.get("b"));
