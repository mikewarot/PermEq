// The PermEq interpreter (stub)
import { Environment } from "./environment";
import type { Statement, Expression } from "./ast";

function evalExpr(expr: Expression, env: Environment): number {
  switch (expr.type) {
    case "NumberLiteral":
      return expr.value;
    case "Identifier":
      return env.get(expr.name) ?? 0;
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
    if (stmt.type === "Assignment") {
      if (stmt.persistent) {
        // Save as persistent: value tracks expression
        const value = evalExpr(stmt.value, env);
        env.set(stmt.name, value, stmt.value);
      } else {
        // Normal assignment
        const value = evalExpr(stmt.value, env);
        env.set(stmt.name, value);
      }
    } else if (stmt.type === "ExpressionStatement") {
      evalExpr(stmt.expression, env);
    }
  }
  // After all assignments, update persistent bindings
  env.reevaluateAll(expr => evalExpr(expr, env));
}
