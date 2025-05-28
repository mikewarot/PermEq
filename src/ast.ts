// AST node types for PermEq

export type Expression =
  | { type: "NumberLiteral"; value: number }
  | { type: "Identifier"; name: string }
  | { type: "BinaryExpression"; left: Expression; operator: string; right: Expression };

export type Statement =
  | { type: "Assignment"; name: string; value: Expression; persistent: boolean }
  | { type: "ExpressionStatement"; expression: Expression };
