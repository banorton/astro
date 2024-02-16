export type NodeType = "Program" | "NumericLiteral" | "Identifier" | "BinaryExpression" | "NullLiteral";

// Statement
export interface Statement {
    kind: NodeType;
}

export interface Program extends Statement {
    kind: "Program";
    body: Statement[];
}

// Expression
export interface Expression extends Statement {}

export interface BinaryExpression extends Expression {
    kind: "BinaryExpression"
    left: Expression
    right: Expression
    operator: string;
}

export interface Identifier extends Expression {
    kind: "Identifier"
    symbol: string;
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral"
    symbol: number;
}

export interface NullLiteral extends Expression {
    kind: "NullLiteral"
    symbol: "null";
}