// A very basic parser for PermEq (stub)
import type { Statement, Expression } from "./ast";

// This simple parser only handles statements like: a = 2 or b ≡ a + 3
export function parse(tokens: string[]): Statement[] {
  // TODO: Replace with a real parser
  // Example: ["a", "≡", "b", "+", "3"]
  if (tokens.length === 0) return [];

  // Only parses one statement for now
  let i = 0;

  function parseExpression(): Expression {
    // Only handles identifiers or number literals, or binary expressions
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
  const persistent = assignOp === "≡";
  const value = parseExpression();

  return [
    {
      type: "Assignment",
      name,
      value,
      persistent,
    },
  ];
}
