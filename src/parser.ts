import type {
  Statement,
  Expression,
  Assignment,
  ExpressionStatement,
  PrintStatement,
  ForStatement,
  NumberLiteral,
  StringLiteral,
  Identifier,
  BinaryExpression,
} from "./ast";

// Helper to check if a token is a string literal (e.g., '"hello"')
function isStringLiteral(token: string): boolean {
  return token.length >= 2 && token[0] === '"' && token[token.length - 1] === '"';
}

function parseExpression(tokens: string[], i: { value: number }): Expression {
  let left: Expression;
  let token = tokens[i.value];

  if (/^\d+$/.test(token)) {
    left = { type: "NumberLiteral", value: Number(token) } as NumberLiteral;
    i.value++;
  } else if (isStringLiteral(token)) {
    left = { type: "StringLiteral", value: token.slice(1, -1) } as StringLiteral;
    i.value++;
  } else {
    left = { type: "Identifier", name: token } as Identifier;
    i.value++;
  }
  if (
    i.value < tokens.length &&
    ["+", "-", "*", "/"].includes(tokens[i.value])
  ) {
    const operator = tokens[i.value++];
    const right = parseExpression(tokens, i);
    return {
      type: "BinaryExpression",
      left,
      operator,
      right,
    } as BinaryExpression;
  }
  return left;
}

// Parse a single statement
function parseStatement(tokens: string[]): Statement | null {
  if (tokens.length === 0) return null;

  // "print" statement
  if (tokens[0] === "print") {
    let i = 1;
    const arg = parseExpression(tokens, { value: i });
    return {
      type: "PrintStatement",
      argument: arg,
    } as PrintStatement;
  }

  // "for ... = ... to ..."
  if (tokens[0] === "for") {
    // for i = 1 to 5
    let idx = 1;
    const variable = tokens[idx++];
    if (tokens[idx++] !== "=") throw new Error("Expected '=' in for loop");
    const start = parseExpression(tokens, { value: idx });
    idx += (start.type === "BinaryExpression" ? 3 : 1);
    if (tokens[idx++] !== "to") throw new Error("Expected 'to' in for loop");
    const end = parseExpression(tokens, { value: idx });
    // Body is handled in the multi-line parser below
    return {
      type: "ForStatement",
      variable,
      start,
      end,
      body: [],
    } as ForStatement;
  }

  // Assignment: name = expr or name ≡ expr
  let i = 0;
  const name = tokens[i++];
  const assignOp = tokens[i++];
  if (!assignOp) return null;
  const persistent = assignOp === "≡";
  const value = parseExpression(tokens, { value: i });

  return {
    type: "Assignment",
    name,
    value,
    persistent,
  } as Assignment;
}

// Multi-line parser supporting for/end blocks
export function parseLines(tokenLines: string[][]): Statement[] {
  const statements: Statement[] = [];
  let i = 0;

  while (i < tokenLines.length) {
    const tokens = tokenLines[i];
    if (tokens[0] === "for") {
      // Parse for ... end block
      const forHeader = parseStatement(tokens) as ForStatement;
      i++;
      // Gather body lines until "end"
      const bodyLines: string[][] = [];
      while (i < tokenLines.length && !(tokenLines[i][0] === "end")) {
        bodyLines.push(tokenLines[i]);
        i++;
      }
      forHeader.body = parseLines(bodyLines);
      statements.push(forHeader);
      i++; // skip "end"
    } else if (tokens[0] === "end") {
      // Handled above
      i++;
    } else {
      const stmt = parseStatement(tokens);
      if (stmt) statements.push(stmt);
      i++;
    }
  }
  return statements;
}