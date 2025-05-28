export type NumberLiteral = {
  type: "NumberLiteral";
  value: number;
};

export type StringLiteral = {
  type: "StringLiteral";
  value: string;
};

export type Identifier = {
  type: "Identifier";
  name: string;
};

export type BinaryExpression = {
  type: "BinaryExpression";
  left: Expression;
  operator: string;
  right: Expression;
};

export type Assignment = {
  type: "Assignment";
  name: string;
  value: Expression;
  persistent: boolean;
};

export type ExpressionStatement = {
  type: "ExpressionStatement";
  expression: Expression;
};

export type PrintStatement = {
  type: "PrintStatement";
  argument: Expression;
};

export type ForStatement = {
  type: "ForStatement";
  variable: string;
  start: Expression;
  end: Expression;
  body: Statement[];
};

export type Expression = NumberLiteral | StringLiteral | Identifier | BinaryExpression;
export type Statement =
  | Assignment
  | ExpressionStatement
  | PrintStatement
  | ForStatement;