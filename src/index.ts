// Entrypoint for PermEq
import { tokenize } from './lexer';
import { parse } from './parser';
import { interpret } from './interpreter';
import { Environment } from './environment';

// Example usage:
const code = `
a = 2 + 2
b ≡ a * 3
`;

const tokens = tokenize(code);
const statements = parse(tokens);
const env = new Environment();
interpret(statements, env);

console.log("Welcome to PermEq! A language where '=' is not the only way.");
console.log("PermEq interpreter initialized.");
