import { Environment } from "./environment";
import type {
  Statement,
  Expression,
  ForStatement,
  PrintStatement,
  NumberLiteral,
  StringLiteral,
  Identifier,
  BinaryExpression,
} from "./ast";

// Exported so index.ts can call it for reevaluation
export function evalExpr(expr: Expression, env: Environment): any {
  switch (expr.type) {
    case "NumberLiteral":
      return expr.value;
    case "StringLiteral":
      return expr.value;
    case "Identifier": {
      const v = env.get(expr.name);
      return v !== undefined && v !== null ? v : 0;
    }
    case "BinaryExpression":
      const left = evalExpr(expr.left, env);
      const right = evalExpr(expr.right, env);
      switch (expr.operator) {
        case "+": return left + right;
        case "-": return left - right;
        case "*": return left * right;
        case "/": return left / right;
        default: throw new Error("Unknown operator: " + expr.operator);
      }
    default:
      throw new Error("Unknown expression type");
  }
}

export function interpret(statements: Statement[], env: Environment) {
  for (const stmt of statements) {
    switch (stmt.type) {
      case "Assignment":
        if (stmt.persistent) {
          // Save as persistent: value tracks expression
          const value = evalExpr(stmt.value, env);
          env.set(stmt.name, value, stmt.value);
        } else {
          // Normal assignment
          const value = evalExpr(stmt.value, env);
          env.set(stmt.name, value);
        }
        break;
      case "ExpressionStatement":
        evalExpr(stmt.expression, env);
        break;
      case "PrintStatement":
        // Evaluate and print
        const val = evalExpr(stmt.argument, env);
        console.log(val);
        break;
      case "ForStatement":
        runForStatement(stmt, env);
        break;
    }
  }
  // After all assignments, update persistent bindings
  env.reevaluateAll(function(expr) { return evalExpr(expr, env); });
}

function runForStatement(stmt: ForStatement, env: Environment) {
  const start = evalExpr(stmt.start, env);
  const end = evalExpr(stmt.end, env);
  for (let i = start; i <= end; ++i) {
    env.set(stmt.variable, i);
    interpret(stmt.body, env);
  }
}