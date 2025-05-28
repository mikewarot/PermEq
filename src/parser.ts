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

// Now just parse one statement per call
export function parse(tokens: string[]): Statement[] {
  const stmt = parseStatement(tokens);
  return stmt ? [stmt] : [];
}