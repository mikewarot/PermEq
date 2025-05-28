// Improved parser for PermEq that handles multiple statements
import type { Statement, Expression } from "./ast";

// Parse a single statement from tokens
function parseStatement(tokens: string[]): Statement | null {
  if (tokens.length === 0) return null;
  let i = 0;

  function parseExpression(): Expression {
    let left: Expression;
    if (/\d+/.test(tokens[i])) {
      left = { type: "NumberLiteral", value: Number(tokens[i++]) };
    } else {
      left = { type: "Identifier", name: tokens[i++] };
    }
    if (i < tokens.length && ["+", "-", "*", "/"].includes(tokens[i])) {
      const operator = tokens[i++];
      const right = parseExpression();
      return { type: "BinaryExpression", left, operator, right };
    }
    return left;
  }

  // Parse assignment: name = expr or name ≡ expr
  const name = tokens[i++];
  const assignOp = tokens[i++];
  if (!assignOp) return null;
  const persistent = assignOp === "≡";
  const value = parseExpression();

  return {
    type: "Assignment",
    name,
    value,
    persistent,
  };
}

export function parse(tokens: string[]): Statement[] {
  // Split tokens into statements at each '=' or '≡' that is not the first token
  // Or just split input into lines and parse each line (simpler for now)
  // (Assumes one statement per line)
  const rawInput = tokens.join(' ');
  const lines = rawInput.split(/(?<=;)|\n/).map(line => line.trim()).filter(Boolean);
  const statements: Statement[] = [];
  for (const line of lines) {
    const lineTokens = line
      .replace(/([=≡()+\-*/])/g, " $1 ")
      .split(/\s+/)
      .filter(Boolean);
    const stmt = parseStatement(lineTokens);
    if (stmt) statements.push(stmt);
  }
  return statements;
}